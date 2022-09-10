import {
    Action,
    ActionPanel,
    closeMainWindow,
    Form,
    getPreferenceValues,
    popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { appendFileSync } from "node:fs";
import Cache from "./utils/cache";
import { parseCommand, makeConfig } from "./utils/config";
import { PreferenceValues } from "./types";

type CommandTypeValues = {
    mode: "command";
    command: string;
    password?: string;
    host?: string;
    root?: string;
};
type SeparationTypeValues = {
    mode: "separation";
    password?: string;
    host?: string;
    root?: string;
    port: string;
    hostName: string;
    user: string;
};

type Values = CommandTypeValues | SeparationTypeValues;

export default function addConfig() {
    const [, setPort] = useState<string>("");
    const [, setHostName] = useState<string>("");
    const [, setUser] = useState<string>("");
    const [, setCommand] = useState<string>("");
    const [, setPassword] = useState<string | undefined>();
    const [, setHost] = useState<string | undefined>();
    const [, setRoot] = useState<string | undefined>();
    const [mode, setMode] = useState("command");

    const onSubmit = async (values: Values) => {
        const { sshConfigPath } = getPreferenceValues<PreferenceValues>();

        const { port, user, hostName } =
            values.mode === "command" ? parseCommand(values.command) : values;
        const _host = values.host || hostName;

        const config = {
            port,
            hostName,
            user,
            host: _host,
            password: values.password,
            root: values.root,
        };

        const cache = new Cache();
        cache.set(_host, JSON.stringify(config));

        const data = makeConfig(config);
        appendFileSync(sshConfigPath, data);

        await closeMainWindow({ clearRootSearch: true });
        await popToRoot({ clearSearchBar: true });
    };

    return (
        <>
            <Form
                actions={
                    <ActionPanel>
                        <Action.SubmitForm onSubmit={onSubmit} />
                        <ActionPanel.Submenu title="change mode">
                            <Action
                                title="Separation"
                                onAction={() => setMode("separation")}
                            />
                            <Action
                                title="Command"
                                onAction={() => setMode("command")}
                            />
                        </ActionPanel.Submenu>
                    </ActionPanel>
                }
            >
                <Form.Dropdown
                    id="mode"
                    title="Mode"
                    value={mode}
                    onChange={setMode}
                >
                    <Form.Dropdown.Item value="command" title="command" />
                    <Form.Dropdown.Item value="separation" title="separation" />
                </Form.Dropdown>
                {mode === "command" ? (
                    <Form.TextField
                        id="command"
                        title="command"
                        placeholder="ssh -p {port} {host}"
                        onChange={setCommand}
                        autoFocus
                    />
                ) : (
                    <>
                        <Form.TextField
                            id="hostName"
                            title="hostName"
                            onChange={setHostName}
                        />
                        <Form.TextField
                            id="user"
                            title="user"
                            onChange={setUser}
                        />
                        <Form.TextField
                            id="port"
                            title="port"
                            onChange={setPort}
                        />
                    </>
                )}
                <Form.PasswordField
                    id="password"
                    title="password"
                    placeholder="password"
                    onChange={setPassword}
                />
                <Form.TextField
                    id="host"
                    title="host"
                    placeholder="host"
                    onChange={setHost}
                />
                <Form.TextField
                    id="root"
                    title="root"
                    placeholder="root"
                    onChange={setRoot}
                />
            </Form>
        </>
    );
}
