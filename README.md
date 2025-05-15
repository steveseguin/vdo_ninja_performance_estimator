# VDO.Ninja Performance Estimator

[![GitHub stars](https://img.shields.io/github/stars/steveseguin/vdo_ninja_performance_estimator)](https://github.com/steveseguin/vdo_ninja_performance_estimator/stargazers)

A web-based tool to estimate if your system can handle [VDO.Ninja](https://vdo.ninja) sessions based on your hardware specifications and configuration.

**Live Demo:** [https://steveseguin.github.io/vdo_ninja_performance_estimator/](https://steveseguin.github.io/vdo_ninja_performance_estimator/)

![VDO.Ninja Performance Estimator Screenshot](https://github.com/steveseguin/vdo_ninja_performance_estimator/raw/main/screenshot.png)

## Features

- Estimate CPU, GPU, and network load for VDO.Ninja sessions
- Configure hardware specifications (CPU, GPU, RAM, upload bandwidth)
- Adjust software configuration (browser, OS, NVENC usage)
- Set VDO.Ninja-specific parameters (resolution, framerate, bitrate, connection count)
- Select from different operation modes (P2P, Group Room, Broadcasting, Meshcast)
- Apply preset configurations for common use cases
- Receive specific recommendations to improve performance

## How It Works

The estimator uses research-based metrics and benchmarks to calculate resource usage for different VDO.Ninja configurations. The calculations take into account:

- CPU/GPU encoding and decoding capabilities
- Network bandwidth requirements based on resolution, framerate, and codec
- P2P connection overhead for different operation modes
- Hardware acceleration benefits from NVENC and other encoders

## Operation Modes

VDO.Ninja supports several operation modes:

- **P2P (Direct Connections):** Each viewer gets a direct connection to the publisher, requiring separate encoding for each viewer. This is the most CPU intensive for the publisher when multiple viewers are connected.
- **Group Room (Mesh Network):** Participants are connected in a mesh network, with each participant potentially sending to and receiving from multiple others. This can distribute the load but still becomes resource-intensive with many participants.
- **Broadcasting Mode:** One person hosts via VDO.Ninja to multiple viewers. This is more optimized than pure P2P for one-to-many scenarios.
- **Meshcast/SFU Mode:** Uses a Selective Forwarding Unit to reduce load on the publisher by offloading distribution to a server. This significantly reduces CPU and bandwidth requirements for the publisher.

## Performance Factors

Key factors that affect VDO.Ninja performance include:

- **CPU Performance:** WebRTC is primarily CPU-bound, especially for encoding multiple streams. Each P2P connection requires a separate encoding process.
- **Hardware Acceleration:** NVENC (on NVIDIA GPUs) can significantly reduce CPU load by offloading encoding to dedicated hardware on the GPU.
- **Codec Selection:** VP8 is the default and works well for most cases. H.264 may offer hardware acceleration on some devices. VP9 and AV1 provide better quality at lower bitrates but require more CPU.
- **Resolution and Framerate:** Higher values increase quality but significantly increase CPU/GPU load and bandwidth requirements.
- **Network Bandwidth:** Upstream bandwidth is a major limiting factor, especially in P2P mode where separate streams are sent to each viewer.
- **Connection Count:** Each additional connection in P2P mode adds significant CPU load and bandwidth requirements.

## Hardware Acceleration Notes

Hardware acceleration can significantly improve performance:

- **NVENC (NVIDIA):** Available on most NVIDIA GPUs from GTX 700 series and newer. RTX GPUs have improved encoders. Typically supports up to 3 simultaneous encoding sessions.
- **QuickSync (Intel):** Available on Intel CPUs with integrated graphics. Performance varies by generation.
- **AMD VCE/VCN:** Available on AMD GPUs. Support in browsers may be limited.
- **Browser Support:** Chrome and Edge typically have the best hardware acceleration support for WebRTC.

## Limitations

This tool provides estimates based on typical performance characteristics. Actual performance may vary based on:

- Specific hardware configurations and optimizations
- System background processes
- Network conditions and latency
- Browser versions and WebRTC implementations

Always test your actual setup before critical productions.

## Contributing

Contributions to the VDO.Ninja Performance Estimator are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Related Projects

- [VDO.Ninja](https://github.com/steveseguin/vdo.ninja) - The main VDO.Ninja repository
- [VDO.Ninja Documentation](https://docs.vdo.ninja) - Official documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built by [Steve Seguin](https://github.com/steveseguin), the creator of VDO.Ninja
- Thanks to the VDO.Ninja community for providing feedback and testing
