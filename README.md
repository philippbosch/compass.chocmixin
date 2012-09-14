# Compass mixin for Chocolat

This mixin enables compilation of [Compass](http://compass-style.org/) projects in [Chocolat](http://chocolatapp.com).

## Requirements

 * Chocolat 1.3 greater

## Installation

In Chocolat simply go to **Actions › Install Mixins** and check
the **compass** item.

## Usage

Compass compilation is invoked automatically every time you save a 
`.scss` file using the `Cmd-S` shortcut. The mixin looks for a 
`config.rb` in the current or a parent directory. If compilation 
succeeds, a notification is displayed (OSX 10.8 only). If an error 
happens, a popover with the output from the compass binary is shown.

## Known Issues

For the mixin to be able to find the compass binary on your `PATH`
Chocolat needs to be started from a Terminal window using the `choc`
command line tool. Otherwise Chocolat does not read the `PATH` 
environment variable from your login shell. Please feel free to 
propose a better solution. See issue #1.

## License 

[MIT](http://philippbosch.mit-license.org/)
