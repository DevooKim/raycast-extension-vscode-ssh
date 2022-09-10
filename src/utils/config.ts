import { Config } from "../types";

export const parseCommand = (command: string) => {
    const [, , port, target] = command.split(" ");

    const [user, hostName] = target.split("@");
    return { port, user, hostName };
};

export const makeConfig = ({ host, hostName, user, port }: Config) => {
    return `
Host ${host}
    HostName ${hostName}
    Port ${port}
    User ${user}
`;
};
