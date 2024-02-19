precision mediump float;

varying float normalizedHeight;

void main()
{
    vec3 color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), normalizedHeight);
    gl_FragColor = vec4(color, 1.0);
}