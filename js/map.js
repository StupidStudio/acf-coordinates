/*
 * This file is part of Advanced Custom Fields Coordinates.
 *
 * Avanced Custom Fields Coordinates is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License as
 * published by he Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced Custom Fields Coordinates is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Advanced Custom Fields Coordinates.
 * If not, see <http://www.gnu.org/licenses/>.
 */

jQuery(function($) {

    /* ******* SET UP COORDINATESMAP ******* */

    // the structure used in this code, is better described at
    // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
    // than anything I could put together in these comments
    //
    // the benefit of this pattern is that it clearly sets up a
    // constructor (CoordinatesMap) and then gathers its methods in asCoordinatesMap
    // and to create a new CoordinatesMap, you just create a new object of type
    // CoordinatesMap - the advantage being that the code is easily organized
    // due to the mixin-like pattern, and its easy to reuse the functionality
    // for any number of coordinates maps you want

    /*
     * CoordinatesMap constructor
     */
    var CoordinatesMap = function(map_elm) {
        this.map_elm = map_elm;
        this.container_elm = this.map_elm.parent().parent();
        this.input_elm = this.container_elm.find('.location_coordinates_input_search');
        this.coordinates_elm = this.container_elm.find('.location_coordinates_coordinates_dd');
        this.values_elm = this.container_elm.find('.location_coordinates_values');

        this.geocoder = new google.maps.Geocoder();

        // set up start position
        var values = $.parseJSON(this.values_elm.val());
        if (!values) values = {'address': '', 'lat': 0, 'lng': 0, 'zoom': 0};

        var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: values.zoom,
                center: new google.maps.LatLng(values.lat, values.lng)
        };

        this.map = new google.maps.Map(this.map_elm[0], mapOptions);

        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });

        this.RegisterHandlers();

        this.UpdateUI(values.lat, values.lng, values.address);
    };

    /*
     * CoordinatesMap methods
     */
    var asCoordinatesMap = (function() {

        /*
         * RegisterHandlers
         *
         * Takes care of setting up events for interaction with
         * the coordinates map
         */
        var RegisterHandlers = function() {
            var self = this;

            // detect return key press on the input element and call
            // resolveAddress with the value from the input element
            self.input_elm.keypress(function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    self.ResolveAddress($(this).val());
                }
            });

            // we save the zoom level to the value field, so that next time
            // you look at the map, its at the same zoom level as you left it
            google.maps.event.addListener(this.map, 'zoom_changed', function(mapEvent) {
                var values = $.parseJSON(self.values_elm.val());
                if (!values) values = {'address': '', 'lat': 0, 'lng': 0, 'zoom': 0};
                values.zoom = self.map.getZoom();
                self.values_elm.val(JSON.stringify(values));
            });

            // detect when the map marker is moved and recalculate location
            // coordinates and tell updateUI about it when it happens
            google.maps.event.addListener(this.marker, 'dragend', function(mapEvent) {
                var lat = mapEvent.latLng.lat(),
                    lng = mapEvent.latLng.lng(),
                    // use the last typed address as the name of the address
                    // when the marker is dragged
                    address = self.input_elm.val();
                self.UpdateUI(lat, lng, address);
            });
        };

        /*
         * ResolveAddress
         *
         * Resolves a written address by finding its latitude and longitude
         *
         * @param   address - string describing a physical location
         */
        var ResolveAddress = function(address) {
            var self = this;
            this.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latlng = results[0].geometry.location;
                    self.map.setCenter(latlng);
                    self.UpdateUI(latlng.lat(), latlng.lng(), address);
                }
                else {
                    self.ReportError("Failed to load location");
                }
            });
        };

        /*
         * UpdateUI
         *
         * Updates the map, position and coordinations in the UI
         *
         * @param   lat - latitude
         * @param   lng - longitude
         */
        var UpdateUI = function(lat, lng, address) {
            var new_position = new google.maps.LatLng(lat, lng);
            this.marker.setPosition(new_position);

            this.input_elm.val(address);
            this.coordinates_elm.text(lat + ", " + lng);
            
            var values = {
                'address': address,
                'lat': lat,
                'lng': lng,
                'zoom': this.map.getZoom()};
            this.values_elm.val(JSON.stringify(values));
        };

        /*
         * ReportError
         *
         * Reports an error to the UI
         *
         * @param   msg
         */
        var ReportError = function(msg) {
            if (window.console) console.log(msg);
        };

        return function() {
            this.RegisterHandlers = RegisterHandlers;
            this.ResolveAddress = ResolveAddress;
            this.UpdateUI = UpdateUI;
            this.ReportError = ReportError;
            return this;
        };

    })();

    // assign CoordinatesMap's prototype to asCoordinatesMap this-reference
    // to propagate CoordinatesMap with methods
    asCoordinatesMap.call(CoordinatesMap.prototype);

    /* ******* INITIALIZE ******** */

    // find each map on the page and hook it up by create a new instance of
    // CoordinatesMap for each of the maps
    $(document).live('acf/setup_fields', function(ev, div) {
        $(div).find('.location_coordinates_map').each(function() {
            new CoordinatesMap($(this));
        });
    });


});
