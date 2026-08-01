import React from "react";

/**
 * Marcado mínimo para el cuerpo de los casos: `**negrita**` y `` `código` ``.
 * Devuelve nodos de React, nunca HTML crudo, así que el contenido no puede
 * inyectar marcado aunque algún día venga de una fuente externa.
 */
export function richText(input: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(input.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<code key={key++}>{match[2]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    nodes.push(input.slice(lastIndex));
  }

  return nodes;
}
