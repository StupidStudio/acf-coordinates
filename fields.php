<?php

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

class acf_field_coordinates extends acf_field
{
    public $defaults; // default field options

    /*
     * __construct
     */
    public function __construct()
    {
        $this->name = 'coordinates-field';
        $this->label = 'Coordinates map';
        $this->category = __('Content', 'acf');

        // default values sets the map to center around ryttergade 12
        $this->defaults = array(
            'center' => array(
                'lat' => 55.399797,
                'lng' => 10.396201),
            'zoom' => 12
        );

        // call parent acf_field's constructor
        parent::__construct();

        // settings
        $this->settings = array(
            'path' => apply_filters('acf/helpers/get_path', __FILE__),
            'dir' => apply_filters('acf/helpers/get_dir', __FILE__),
            'version' => '1.0.0'
        );
    }

    /*
    *  input_admin_enqueue_scripts
    *
    *  This action is called in the admin_enqueue_scripts action on the edit screen where your field is created.
    *  Use this action to add css + javascript to assist your create_field() action.
    */

    public function input_admin_enqueue_scripts()
    {
        // register scripts and css
        wp_register_style('acf-coordinates-field', $this->settings['dir'].'css/fields.css'); 
        wp_register_script("googlemaps-api", "//maps.googleapis.com/maps/api/js?sensor=false");
        wp_register_script('acf-coordinates-map', $this->settings['dir'].'js/map.js'); 

        // load scripts and styles
        wp_enqueue_style(array('acf-coordinates-field'));
        wp_enqueue_script(array('googlemaps-api', 'acf-coordinates-map'));
    }

    /*
     * create_field
     *
     * Create the HTML interface for the field.
     *
     * @param   $field - an array containing the fields data
     */
    public function create_field($field)
    {
        // load default data into the field
        $field = array_merge($this->defaults, $field);

        $lat = $field['center']['lat'];
        $lng = $field['center']['lng'];
        $zoom = $field['zoom'];

        // generate a unique id and put it as suffix to the fields name
        // the field name includes [ and ] so we just replace them with
        // more proper values for use in an html attribute
        $ptrns = array('/\[/', '/\]/');
        $rplcs = array('_', '');
        $uid = preg_replace($ptrns, $rplcs, $field['name']);

        // if field value is not a valid json string, create a new one with
        // the default values
        if (!json_decode($field['value'])) {
            $values = json_encode(array(
                'address' => '',
                'lat' => $lat,
                'lng' => $lng,
                'zoom' => $zoom));
        }
        else {
            $values = $field['value'];
        }
        ?>
<div>
    <input type="hidden" class="location_coordinates_values" id="location_coordinates_values_<?=esc_attr($uid)?>" name="<?=esc_attr($field['name'])?>" value="<?=esc_attr($values)?>">
    <dl>
        <dt class="location_coordinates_coordinates_dt">Coordinates: &nbsp;</dt>
        <dd class="location_coordinates_coordinates_dd"></dd>
    </dl>
    <input type="text" class="location_coordinates_input_search" id="location_coordinates_input_<?=esc_attr($uid)?>" placeholder="Search for a location">
    <div class="location_coordinates_map_container">
        <div class="location_coordinates_map" id="location_coordinates_map_<?=$uid?>"></div>
    </div>
</div>
        <?php
    }

    /*
     * format_value_for_api
     *
     * The data in the API is json encoded so we json decode
     * it as an array before returning it so its easily usable
     *
     * we also remove the zoom attribute since its only of importance
     * in the backend
     *
     * @param   $value - the value loaded from the database
     * @param   $post_id - the id of the loaded post
     * @param   $field - the field array holding all the field options
     */
    public function format_value_for_api($value, $post_id, $field)
    {
        $value_arr = json_decode($value, true);
        unset($value_arr['zoom']);
        return $value_arr;
    }

}

new acf_field_coordinates();
