import {
    Action,
    ActionPanel,
    Form,
    getPreferenceValues,
    closeMainWindow,
    popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { appendFileSync } from "node:fs";
import Cache from "./utils/cache";
import { parseCommand, makeConfig } from "./utils/config";
import { PreferenceValues } from "./types";

type Values = {
    mode: "command";
    command: string;
    password?: string;
    host?: string;
    root?: string;
};

export default function addConfig() {
    const [, setCommand] = useState<string>("");
    const [, setPassword] = useState<string | undefined>();
    const [, setHost] = useState<string | undefined>();
    const [, setRoot] = useState<string | undefined>();

    const onSubmit = async (values: Values) => {
        const { sshConfigPath } = getPreferenceValues<PreferenceValues>();

        const { port, user, hostName } = parseCommand(values.command);
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
                    </ActionPanel>
                }
            >
                <Form.TextField
                    id="command"
                    title="command"
                    placeholder="ssh -p {port} {host}"
                    onChange={setCommand}
                    autoFocus
                />
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
