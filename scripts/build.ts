import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { DEFAULT_DIST_DIR } from './constants';
import { initKeystone } from "../src/keystone";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    process.env.NODE_ENV = 'production';

    const { keystone, apps } = initKeystone({ get: (...params) => 'mock' } as ConfigService);
    console.log('Initialised Keystone instance');

    const resolvedDistDir = path.resolve(__dirname, '../', DEFAULT_DIST_DIR);
    console.log(`Exporting Keystone build to ./${resolvedDistDir}`);

    await fs.remove(resolvedDistDir);

    if (apps) {
        await Promise.all(
            apps.filter(app => (app as any).build).map(app => (app as any).build({
                distDir: resolvedDistDir,
                keystone
            }))
        );

        console.log(
            chalk.green.bold(`Exported Keystone build to ./${resolvedDistDir}`)
        );
    }

    process.exit(0);
}

bootstrap();
