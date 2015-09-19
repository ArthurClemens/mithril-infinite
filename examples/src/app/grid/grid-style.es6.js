const grid_spacing = 8;
const grid_spacing_px = grid_spacing + 'px';
const item_width = 210;
const item_width_px = item_width + 'px';
const main_padding = grid_spacing;
const image_holder_padding = 10;
const image_holder_padding_px = image_holder_padding + 'px';

const makeMediaStyle = function(which, cols) {
	return {
		['@media (' + which + '-width: ' + ((cols+1) * item_width + cols * grid_spacing) + 'px)']: {
			'.scroll-view.grid': {
				' .scroll-content': {
					' .content': {
						'width': cols * item_width + (cols-1) * grid_spacing + 'px'
					}
				}
			}
		}
	};
};
 
const styles = [
	makeMediaStyle('min', 4),
	makeMediaStyle('max', 4),
	makeMediaStyle('max', 3),
	makeMediaStyle('max', 2),
	makeMediaStyle('max', 1),
	{
		'.scroll-view.grid': {
			'margin': '0 auto',
			'background': '#fff',
			
			' .scroll-content': {
				'padding': 2*grid_spacing + 'px 0',
				
				' .content': {
					'margin': '0 auto',
					'font-size': 0,
					
					' .page': {
						'margin': '0 ' + (-grid_spacing/2) + 'px'
					},
					' .grid-item': {
						'display': 'inline-block',
						'height': item_width_px,
						'width': item_width_px,
						'background-color': '#f0f0f0',
						'margin': '0 ' + grid_spacing/2 + 'px ' + grid_spacing_px + ' ' + grid_spacing/2 + 'px',
						
						' .image-holder': {
							'height': item_width - 2 * image_holder_padding + 'px',
							'width': item_width - 2 * image_holder_padding + 'px',
							'overflow': 'hidden',
							'position': 'relative',
							'margin': image_holder_padding_px,

							' .image': {
								'position': 'absolute',
								'left': 'auto',
								'top': 0,
								'right': 'auto',
								'bottom': 0,
								'width': '100%',
								'background-size': 'contain',
								'background-repeat': 'no-repeat',
								'background-position-x': '50%'
							}
						}
					}
				}
			}
		}
	}
];

export default styles;

/*
@media (min-width: 5*$_item_width + 4*$_grid_spacing) {
    .scroll-view.grid {
        .scroll-content {
            .content {
                width: 4*$_item_width + 3*$_grid_spacing;
            }
        }
    }
}
@media (max-width: 5*$_item_width + 4*$_grid_spacing) {
    .scroll-view.grid {
        .scroll-content {
            .content {
                width: 4*$_item_width + 3*$_grid_spacing;
            }
        }
    }
}
@media (max-width: 4*$_item_width + 3*$_grid_spacing) {
    .scroll-view.grid {
        .scroll-content {
            .content {
                width: 3*$_item_width + 2*$_grid_spacing;
            }
        }
    }
}
@media (max-width: 3*$_item_width + 2*$_grid_spacing) {
    .scroll-view.grid {
        .scroll-content {
            .content {
                width: 2*$_item_width + 1*$_grid_spacing;
            }
        }
    }
}
@media (max-width: 2*$_item_width + 1*$_grid_spacing) {
    .scroll-view.grid {
        .scroll-content {
            .content {
                width: 1*$_item_width + 0*$_grid_spacing;
            }
        }
    }
}

*/