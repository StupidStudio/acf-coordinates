<?php

/*
Plugin Name: Advanced Custom Fields: Coordinates
Plugin URI: https://github.com/StupidStudio/acf-coordinates/
Description: Adds a coordinates map field to Advanced Custom Fields. This field allows you to find the coordinates of a location.
Version: 1.0.0
Author: Stupid Studio
Author URI: http://stupid-studio.com/
License: GPL
*/

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

class acf_field_coordinates_plugin {
    
    /*
     * __construct
     */
    function __construct() {
        add_action('acf/register_fields', array($this, 'register_fields'));
    }

    /*
     * register_fields
     */
    function register_fields() {
        include_once 'fields.php';
    }

}

new acf_field_coordinates_plugin();
