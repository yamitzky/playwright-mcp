/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createServerWithTools } from './server.js';
import common from './tools/common.js';
import console from './tools/console.js';
import dialogs from './tools/dialogs.js';
import download from './tools/download.js';
import files from './tools/files.js';
import install from './tools/install.js';
import keyboard from './tools/keyboard.js';
import navigate from './tools/navigate.js';
import network from './tools/network.js';
import pdf from './tools/pdf.js';
import screen from './tools/screen.js';
import snapshot from './tools/snapshot.js';
import tabs from './tools/tabs.js';

import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Config } from '../config.js';
import type { Tool } from './tools/tool.js';

const snapshotTools: Tool<any>[] = [
  ...common(true),
  ...console,
  ...dialogs(true),
  ...files(true),
  ...install,
  ...keyboard(true),
  ...navigate(true),
  ...network,
  ...pdf,
  ...download,
  ...snapshot,
  ...tabs(true),
];

const screenshotTools: Tool<any>[] = [
  ...common(false),
  ...console,
  ...dialogs(false),
  ...files(false),
  ...install,
  ...keyboard(false),
  ...navigate(false),
  ...network,
  ...pdf,
  ...download,
  ...screen,
  ...tabs(false),
];

import packageJSON from '../package.json' with { type: 'json' };

export async function createServer(config: Config = {}): Promise<Server> {
  const allTools = config.vision ? screenshotTools : snapshotTools;
  const tools = allTools.filter(tool => !config.capabilities || tool.capability === 'core' || config.capabilities.includes(tool.capability));
  return createServerWithTools({
    name: 'Playwright',
    version: packageJSON.version,
    tools,
  }, config);
}
