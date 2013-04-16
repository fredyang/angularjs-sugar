(function( ng ) {
	"use strict";

	window.ng = ng;
	var moduleTypes = {
		config: false,
		constant: true,
		controller: true,
		directive: true,
		factory: true,
		filter: true,
		provider: true,
		run: false,
		service: true,
		value: true,
		requires: true
	};

	$.extend( ng, {
		/* a module is like
		 * {
		 *   constant: { },
		 *
		 *
		 * }
		 * */
		//ng.m(name, requires, module)
		//ng.m(name, module)
		m: function( name, requires, module ) {

			if (!ng.isArray( requires )) {
				module = requires;
				requires = [];
			}

			var mod;

			try {
				mod = ng.module( name );
			} catch (e) {
				mod = ng.module( name, requires );
			}

			for (var type in module) {
				if (type in moduleTypes) {
					if (moduleTypes[type]) {
						var thisModule = module[type];
						for (var name in thisModule) {
							mod[type]( name, thisModule[name] );
						}
					} else {
						//type == config, or run
						mod[type]( module[type] );
					}
				}
			}

			return mod;
		}
	} );

	ng.m( "ng" ).run( function( $rootScope ) {
		$rootScope.$extend = function( scope ) {
			ng.extend( this, scope );
			return this;
		};
	} );

	ng.m( "ng" ).config( function( $routeProvider ) {

		$routeProvider.mapRoute = function( routes ) {
			for (var key in routes) {
				var value = routes[key];
				if (mn.isString( value )) {
					if (key === "*") {
						value = {
							redirectTo: value
						};
					} else {
						value = {
							templateUrl: value
						};
					}
				}
				if (key === "*") {
					this.otherwise( value );
				} else {
					this.when( key, value );
				}
			}

		};
	} );

})( angular );