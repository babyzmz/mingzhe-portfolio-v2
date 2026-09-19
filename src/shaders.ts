export const meshVertex = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;
varying float vDepth;
void main(){
 vec4 world=uModel*vec4(aPosition,1.0);
 vec4 view=uView*world;
 vWorld=world.xyz;vLocal=aPosition;
 vNormal=normalize(mat3(uModel)*aNormal);
 vDepth=-view.z;
 gl_Position=uProjection*view;
}`;
export const meshFragment = `
precision highp float;
uniform vec3 uEye;
uniform vec3 uColor;
uniform float uMetal;
uniform float uEmission;
uniform float uAlpha;
uniform float uTime;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vLocal;
varying float vDepth;
vec3 studio(vec3 r){
 vec3 e=mix(vec3(.012,.018,.035),vec3(.17,.21,.27),smoothstep(-.5,.9,r.y));
 float key=pow(max(dot(r,normalize(vec3(-.4,.75,1.))),0.),50.);
 float fill=pow(max(dot(r,normalize(vec3(.8,.1,.6))),0.),15.);
 float strip=exp(-pow((r.x+.36)*14.,2.))*smoothstep(-.45,-.12,r.y)*smoothstep(.3,.5,r.z);
 float longStrip=exp(-pow((r.y-.48)*22.,2.))*smoothstep(-.7,-.15,r.x);
 e+=vec3(1.9,2.,2.2)*key+vec3(.55,.76,.81)*fill;
 e+=vec3(1.5,1.55,1.6)*strip+vec3(1.2,1.3,1.38)*longStrip;
 e+=vec3(.045,.2,.18)*pow(max(dot(r,normalize(vec3(.0,-.8,.7))),0.),10.);
 return e;
}
void main(){
 vec3 n=normalize(vNormal),v=normalize(uEye-vWorld);
 if(!gl_FrontFacing)n=-n;
 vec3 r=reflect(-v,n);
 float fres=pow(1.-max(dot(n,v),0.),3.);
 float diffuse=max(dot(n,normalize(vec3(-.4,.8,1.2))),0.);
 vec3 base=uColor*(.12+.42*diffuse);
 vec3 metal=studio(r)*(.7+.8*fres)*mix(vec3(1.),uColor,.22);
 float brushing=1.-.025*sin(vLocal.x*160.+vLocal.y*35.);
 vec3 col=mix(base,metal*brushing,uMetal);
 col+=uColor*uEmission;
 col+=vec3(.025,.05,.065)*fres;
 col=col/(1.+col*.32);
 col=pow(max(col,vec3(0.)),vec3(.82));
 float fog=1.-smoothstep(14.,25.,vDepth);
 gl_FragColor=vec4(col,uAlpha*fog);
}`;
export const pointVertex = `
attribute vec3 aPosition;
uniform mat4 uView;
uniform mat4 uProjection;
uniform float uSize;
varying float vDepth;
void main(){vec4 p=uView*vec4(aPosition,1.);vDepth=-p.z;gl_Position=uProjection*p;gl_PointSize=clamp(uSize*90./max(.1,-p.z),1.,320.);}`;
export const pointFragment = `
precision mediump float;
uniform vec3 uColor;
uniform float uOpacity;
varying float vDepth;
void main(){vec2 uv=gl_PointCoord-.5;float rr=dot(uv,uv);if(rr>.25)discard;float a=exp(-rr*24.)*(1.-smoothstep(.12,.25,rr));a*=1.-smoothstep(12.,28.,vDepth);gl_FragColor=vec4(uColor,a*uOpacity);}`;
