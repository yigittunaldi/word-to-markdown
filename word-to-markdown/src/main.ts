import TurndownService from '@joplin/turndown';
import * as turndownPluginGfm from '@joplin/turndown-plugin-gfm';
import * as mammoth from 'mammoth';
import markdownlint from 'markdownlint';
import markdownlintRuleHelpers from 'markdownlint-rule-helpers';
import { parse } from 'node-html-parser';

interface ConvertOptions {
  mammoth?: object;
  turndown?: object;
}

interface TurndownOptions {
  headingStyle?: 'setext' | 'atx';
  codeBlockStyle?: 'indented' | 'fenced';
  bulletListMarker?: '*' | '-' | '+';
}

const defaultTurndownOptions: TurndownOptions = {
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
};


function autoTableHeaders(html: string): string {
  const root = parse(html);
  root.querySelectorAll('table').forEach((table) => {
    const firstRow = table.querySelector('tr');
    firstRow.querySelectorAll('td').forEach((cell) => {
      cell.tagName = 'th';
    });
  });
  return root.toString();
}

function htmlToMd(html: string, options: TurndownOptions = defaultTurndownOptions): string {
  const turndownService = new TurndownService(options);
  turndownService.use(turndownPluginGfm.gfm);
  return turndownService.turndown(html).trim();
}

function lint(md: string): string {
  const lintResult = markdownlint.sync({ strings: { md } });
  return markdownlintRuleHelpers.applyFixes(md, lintResult['md']).trim();
}

export default async function convert(
  input: string | ArrayBuffer,
  options: ConvertOptions = {},
): Promise<string> {
  let inputObj: { path: string } | { arrayBuffer: ArrayBuffer };
  if (typeof input === 'string') {
    inputObj = { path: input };
  } else {
    inputObj = { arrayBuffer: input };
  }
  const mammothResult = await mammoth.convertToHtml(inputObj, options.mammoth);
  const html = autoTableHeaders(mammothResult.value);
  const md = htmlToMd(html, options.turndown as TurndownOptions);
  const cleanedMd = lint(md);
  return cleanedMd;
}
