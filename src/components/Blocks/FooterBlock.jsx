import React from "react";

const FooterBlock = ({ block, onSelect }) => {
  const props = block.props || {};

  const style = {
    backgroundColor: props.backgroundColor,
    color: props.color,
    padding: props.padding,
    textAlign: props.textAlign,
    fontSize: props.fontSize?.includes("px")
      ? props.fontSize
      : props.fontSize + "px",
    lineHeight: props.lineHeight,
    marginTop: props.marginTop,
  };

  const handleClick = (e) => {
    if (onSelect) {
      e.stopPropagation();
      onSelect(block.id);
    }
  };

  return (
    <footer style={style} onClick={handleClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        {(props.columns || []).map((col, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: "150px" }}>
            <h4 style={{ marginBottom: "10px", fontWeight: "bold" }}>
              {col.title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {(col.items || []).map((item, i) => {
                if (typeof item === "string") {
                  return <li key={i}>{item}</li>;
                } else if (item.icon) {
                  return (
                    <li key={i}>
                      <a
                        href={item.link}
                        style={{ color: props.color, textDecoration: "none" }}
                      >
                        🔗 {item.icon}
                      </a>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        ))}
      </div>

      {props.showCopyright && (
        <div style={{ marginTop: "30px", color: props.copyrightColor }}>
          {props.copyrightText}
        </div>
      )}
    </footer>
  );
};

export default FooterBlock;
