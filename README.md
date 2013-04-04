Advanced Custom Fields Coordinates
==================================

This add-on to [Advanced Custom Fields (ACF)](http://www.advancedcustomfields.com/ "Advanced Custom Fields")
makes it easy to add coordinates to your posts by choosing the location on a
visual map or by searching for an address.

This software is licensed under the GNU General Public License version 3. See
gpl.txt included with this software for more detail.

## Usage

### Backend

Install this plugin by downloading [the source](https://github.com/ChrisBuchholz/mencfs/archive/master.zip)
and unzipping it into the plugin folder in your WordPress installation. Make
sure to also have ACF installed.

Then when you create a new custom field with ACF, set the field type to
**Coordinates map**. Now the coordinates chooser should show up when you edit
a post with your custom fields.

### Frontend

To get the coordinates data in your frontend, simply request the field value
and in return you get the latitude, longitude and the address.

    $values = get_field('*****FIELD_NAME*****');
    $lat = $values['lat'];
    $lng = $values['lng'];
    $address = $values['address'];

Address is not the exact, correct name of the location. Instead it is the 
term you wrote when searching for the coordinates.
