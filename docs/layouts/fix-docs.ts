/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as path from 'path';
import * as shell from 'shelljs';

const nodeModulesDir = path.resolve(__dirname, '../../node_modules/');

// Pages Theme Plugin
const pagesThemeDir = path.resolve(nodeModulesDir, 'typedoc-plugin-pages/dist/theme/v2');
// Default Theme
const defaultTheme = path.resolve(nodeModulesDir, 'typedoc-default-themes/bin/default');

// Fix Theme
// shell.cp(path.resolve(defaultTheme, './partials/type.hbs'), path.resolve(pagesThemeDir, './partials/'));
shell.cp(path.resolve(defaultTheme, './partials/*'), path.resolve(pagesThemeDir, './partials/'));
shell.cp('-R', path.resolve(defaultTheme, './assets/*'), path.resolve(pagesThemeDir, './assets/'));

// Google Analytics
shell.cp(path.resolve(__dirname, './analytics.hbs'), path.resolve(pagesThemeDir, './partials/'));
shell.cp(path.resolve(__dirname, './default.hbs'), path.resolve(pagesThemeDir, './layouts/'));
