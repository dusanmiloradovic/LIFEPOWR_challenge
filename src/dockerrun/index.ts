import Docker, {Container} from "dockerode";
import * as process from "process";

const IMAGE = "public.ecr.aws/k1u2a6n3/lp_ev_emulator";

export class DockerRunner {
  docker: Docker;
  container: Container | undefined = undefined;

  constructor(
    private readonly port: number,
    private readonly name: string,
  ) {
    const windows = process.platform === "win32";
    this.docker = new Docker({socketPath: windows ? "//./pipe/docker_engine" : "/var/run/docker.sock"});
  }

  async run() {
    this.container = await this.docker.createContainer({
      Image: IMAGE,
      name: this.name,
      HostConfig: {
        PortBindings: {
          "502/tcp": [{HostPort: this.port.toString()}],
        },
      },
      ExposedPorts: {
        "502/tcp": {},
      },
    });
    await this.container.start();
  }

  async stop() {
    await this.container?.stop();
    await this.container?.remove({force: true});
  }
}
