# Cosmic Particle Shader

vertex
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  float power = 0.05;
  float strength = pow(dot(normal, vec3(0, 0.7, -0.2)), 2);
  color = vec3(power * strength);
}

fragment
uniform float time;
uniform vec2 mousePosition;

void main() {
  vec2 uv = gl_PointCoord;
  float depth = gl_PointCoord.z * 2.0;

  float glow = depth * 0.1 + 0.9;
  float attractForce = 0.03;
  float mouseDistance = distance(mousePosition, uv);

  gl_Color = vec4(
    color * glow * exp(-depth * 0.01),
    1.0); // Add alpha channel for stacking effect
  );
}</script>}}]