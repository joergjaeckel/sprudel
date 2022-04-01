export const vertex = /* glsl */ `
attribute float size;
attribute float opacity;
attribute float sprite;
varying float vOpacity;
varying float vSprite;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <color_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	vOpacity = opacity;
	vSprite = sprite;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}
`

export const fragment = /* glsl */ `
uniform vec3 diffuse;
varying float vOpacity;
varying float vSprite;
//uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

//uniform sampler2D spriteSheet;
uniform vec2 spriteSheetSize;   // In px
uniform vec2 spriteSize;        // In px
//uniform float sprite;            // Sprite index in sprite sheet (0-...)

void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, vOpacity );
	#include <logdepthbuf_fragment>
	
	float w = spriteSheetSize.x;
    float h = spriteSheetSize.y;
    
    // Normalize sprite size (0.0-1.0)
    float dx = spriteSize.x / w;
    float dy = spriteSize.y / h;
    
    // Figure out number of tile cols of sprite sheet
    // cols = 1024 / 128 = 8
    float cols = w / spriteSize.x;
    
    // From linear index to row/col pair
    // col = mod(0, 8) = 0
    // row = floor(0 / 8) = 0
    float col = mod(vSprite, cols);
    float row = floor(vSprite / cols);
    
    // Finally to UV texture coordinates
    // 1.0 - 0,125 - 1 * 0,125 + 0,125 * y
    
    #if defined( USE_SPRITE )
        vec2 uv = vec2(dx * gl_PointCoord.x + col * dx, 1.0 - row * dy - dy * gl_PointCoord.y);
        // flipY:  1.0 - dy - row * dy + dy * gl_PointCoord.y
    #elif defined( USE_UV )
        vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    #endif

    #if defined( USE_MAP )
        diffuseColor = texture2D( map, uv );
    #endif
    
    #if defined( USE_ALPHAMAP )
        diffuseColor.a *= texture2D( alphaMap, uv ).g;
    #endif
	
	//include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	
	gl_FragColor.xyz *= gl_FragColor.w;
    gl_FragColor.w *= 0.0;
    
}
`
