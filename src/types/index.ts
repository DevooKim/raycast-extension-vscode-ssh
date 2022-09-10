export type Config = {
    host: string;
    hostName: string;
    user: string;
    port: string;
    password?: string;
    root?: string;
};

export type PreferenceValues = {
    sshConfigPath: string;
};
