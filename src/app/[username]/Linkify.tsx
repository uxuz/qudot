import { Fragment, ReactNode } from "react";

const urlRegex = /((?:https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s]*)/g;

const urlCheckRegex =
  /^(?:https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})[^\s]*$/;

function splitTrailingPunctuation(url: string): {
  clean: string;
  trailing: string;
} {
  const match = url.match(/^(.*?)([),.!?;:]*)$/);

  if (!match) return { clean: url, trailing: "" };

  return {
    clean: match[1],
    trailing: match[2],
  };
}

type LinkifyProps = {
  text: string;
};

export function Linkify({ text }: LinkifyProps): ReactNode {
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (urlCheckRegex.test(part)) {
          const { clean, trailing } = splitTrailingPunctuation(part);

          const href = clean.startsWith("http") ? clean : `https://${clean}`;

          return (
            <Fragment key={i}>
              <a href={href} target="_blank" className="text-blue-500">
                {clean}
              </a>
              {trailing}
            </Fragment>
          );
        }

        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
