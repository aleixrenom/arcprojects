import React from "react";

/* Renders effect / milestone text from the catalog. The markdown source
   separates individual effects within one ability as unordered-list lines
   ("- ..."), and some effects are named with a "Name - rest" prefix. Parsing
   happens here at render time (not in the build script) so effect strings
   already saved on characters get the same formatting. */

type EffectBlock =
  | { kind: "para"; text: string }
  | { kind: "item"; name?: string; text: string };

/* A leading "Something - " chunk counts as an effect name only when it's
   short and free of sentence punctuation, so prose that happens to contain
   a dash isn't mistaken for a name. */
const NAME_RE = /^([^.,:;()]{1,40}?)\s+-\s+(.+)$/;

function parseEffectBlocks(text: string): EffectBlock[] {
  const blocks: EffectBlock[] = [];
  let para: string[] = [];
  const flushPara = () => {
    const joined = para.join("\n").trim();
    if (joined) blocks.push({ kind: "para", text: joined });
    para = [];
  };

  for (const line of text.split("\n")) {
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item) {
      flushPara();
      const body = item[1].trim();
      if (!body) continue;
      const named = body.match(NAME_RE);
      if (named) blocks.push({ kind: "item", name: named[1], text: named[2] });
      else blocks.push({ kind: "item", text: body });
    } else {
      para.push(line);
    }
  }
  flushPara();
  return blocks;
}

const EffectText: React.FC<{ text: string }> = ({ text }) => (
  <div className="cs-effect-text">
    {parseEffectBlocks(text).map((block, i) =>
      block.kind === "para" ? (
        <div key={i} className="cs-effect-para">
          {block.text}
        </div>
      ) : (
        <div key={i} className="cs-effect-item">
          {block.name && <span className="cs-effect-pill">{block.name}</span>}
          {block.text}
        </div>
      )
    )}
  </div>
);

export default EffectText;
