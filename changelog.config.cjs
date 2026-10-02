/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */

// Self-contained on purpose: `-n` ignores a `preset` key, and the angular
// preset's templates don't work with conventional-changelog-writer 8.x.

// Angular only surfaces feat/fix/perf/revert; list every type, impact first.
const TYPE_TITLES = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance Improvements',
  revert: 'Reverts',
  refactor: 'Code Refactoring',
  docs: 'Documentation',
  test: 'Tests',
  style: 'Styles',
  build: 'Build System',
  ci: 'Continuous Integration',
  chore: 'Chores',
};

const SECTION_ORDER = Object.values(TYPE_TITLES);

function toSection(type) {
  if (!type) {
    return 'Other Changes';
  }

  const normalized = String(type).toLowerCase();
  if (TYPE_TITLES[normalized]) {
    return TYPE_TITLES[normalized];
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

// Default partial repeats the type in every bullet; print scope + subject.
const commitPartial = `*{{#if scope}} **{{scope}}:**{{/if}} {{#if subject}}{{subject}}{{else}}{{header}}{{/if}}

{{~!-- commit link --}}
{{~#if @root.linkReferences}} ([{{hash}}](
  {{~#if @root.repository}}
    {{~#if @root.host}}
      {{~@root.host}}/
    {{~/if}}
    {{~#if @root.owner}}
      {{~@root.owner}}/
    {{~/if}}
    {{~@root.repository}}
  {{~else}}
    {{~@root.repoUrl}}
  {{~/if}}/
  {{~@root.commit}}/{{hash}}))
{{~else if hash}} {{hash}}{{~/if}}

{{~!-- commit references --}}
{{~#if references~}}
  , closes
  {{~#each references}} {{#if @root.linkReferences~}}
    [
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}#{{this.issue}}](
    {{~#if @root.repository}}
      {{~#if @root.host}}
        {{~@root.host}}/
      {{~/if}}
      {{~#if this.repository}}
        {{~#if this.owner}}
          {{~this.owner}}/
        {{~/if}}
        {{~this.repository}}
      {{~else}}
        {{~#if @root.owner}}
          {{~@root.owner}}/
        {{~/if}}
          {{~@root.repository}}
        {{~/if}}
    {{~else}}
      {{~@root.repoUrl}}
    {{~/if}}/
    {{~@root.issue}}/{{this.issue}})
  {{~else}}
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}#{{this.issue}}
  {{~/if}}{{/each}}
{{~/if}}

`;

// Writer default plus a `### {{title}}` heading per group.
const mainTemplate = `{{> header}}

{{#each commitGroups}}
{{#if title}}
### {{title}}

{{/if}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}

{{/each}}
{{> footer}}
`;

module.exports = {
  parserOpts: {
    // Default `gh-` prefix matched inside words like "high-volume".
    issuePrefixes: ['#'],
  },

  writerOpts: {
    mainTemplate,
    commitPartial,

    groupBy: 'type',
    commitsSort: ['scope', 'subject'],

    commitGroupsSort: (a, b) => {
      const aIndex = SECTION_ORDER.indexOf(a.title);
      const bIndex = SECTION_ORDER.indexOf(b.title);

      // Unknown sections sort last, alphabetically among themselves.
      if (aIndex === -1 && bIndex === -1) {
        return a.title.localeCompare(b.title);
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    },

    transform: (commit) => {
      // `chore(release): vX.Y.Z` is created by the very run that renders this.
      if (commit.type === 'chore' && /^v?\d+\.\d+\.\d+/.test(commit.subject)) {
        return false;
      }

      const nextCommit = { ...commit };

      // A custom transform drops the writer's default hash shortening.
      if (typeof nextCommit.hash === 'string') {
        nextCommit.hash = nextCommit.hash.substring(0, 7);
      }

      nextCommit.type = toSection(nextCommit.type);

      // Keep wildcard scopes from polluting section output.
      if (nextCommit.scope === '*') {
        nextCommit.scope = '';
      }

      return nextCommit;
    },
  },
};
