export const vertex = /* glsl */ `
  #include <common>
  #include <uv_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <logdepthbuf_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;

  uniform vec2 resolution;
  uniform float lineWidth;
  //uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;

  //varying vec2 vUV;
  //varying vec4 vColor;
  varying float vCounters;
  varying float vWidth;

  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    vCounters = counters;
    return res;
  }

  void main() {
    float aspect = resolution.x / resolution.y;
    
    //vColor = vec4(color, opacity);
    //vUV = uv;

    #include <uv_vertex>
    #include <color_vertex>

    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0);
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);

    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);

    vec2 dir;

    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);

      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp( w / dot( miter, perp ), 0., 4. * width );
    }

    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * width;
    normal *= projectionMatrix;

    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy;
    }

    finalPosition.xy += normal.xy * side;

    gl_Position = finalPosition;

    #include <logdepthbuf_vertex>

    #include <fog_vertex>

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  }`

export const fragment = /* glsl */ `
  uniform vec3 diffuse;
  uniform float opacity;
  
  #include <fog_pars_fragment>
  #include <color_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;

  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  
  //varying vec2 vUV;
  #include <uv_pars_fragment>

  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include <logdepthbuf_fragment>
    #include <color_fragment>
  
    vec4 c = vColor;
    //    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );
    #include <map_fragment>
    //    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;
      if( c.a < alphaTest ) discard;
      if( useDash == 1. ){
          c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
      }
      gl_FragColor = c;
      gl_FragColor.a *= step(vCounters, visibility);
  
  THREE.ShaderChunk.fog_fragment,
}`
