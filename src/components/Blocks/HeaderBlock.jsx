import React from "react";

const HeaderBlock = ({ block }) => {
  const props = block.props || {};

  const headerStyle = {
    backgroundColor: props.backgroundColor || "#ffffff",
    color: props.color || "#333333",
    padding: props.padding || "15px 20px",
    height: props.height || "60px",
    boxShadow: props.boxShadow || "0 2px 4px rgba(0,0,0,0.05)",
    position: props.isFixed ? "fixed" : "relative",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 2,
  };

  const navStyle = {
    display: "flex",
    justifyContent:
      props.navAlignment === "left"
        ? "flex-start"
        : props.navAlignment === "center"
        ? "center"
        : "flex-end",
    alignItems: "center",
    gap: "20px",
    fontSize: props.navLinkFontSize || "16px",
    fontWeight: props.navLinkFontWeight || "normal",
    color: props.navLinkColor || "#333",
  };

  const linkStyle = {
    color: props.navLinkColor || "#333",
    textDecoration: "none",
    position: "relative",
  };

  const submenuStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#fff",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "none",
    minWidth: "150px",
    zIndex: 1001,
  };

  const linkContainerStyle = {
    position: "relative",
  };

  return (
    <header style={headerStyle}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {props.logoSrc && (
            <img
              src={props.logoSrc}
              alt={props.logoAlt || "Logo"}
              style={{
                height: props.logoHeight || "40px",
                maxWidth: props.logoMaxWidth || "150px",
              }}
            />
          )}
          <strong>{props.brandName || ""}</strong>
        </div>

        <nav style={navStyle}>
          {(props.navLinks || []).map((link, index) => (
            <div
              key={index}
              style={linkContainerStyle}
              onMouseEnter={(e) => {
                const submenu = e.currentTarget.querySelector(".submenu");
                if (submenu) submenu.style.display = "block";
              }}
              onMouseLeave={(e) => {
                const submenu = e.currentTarget.querySelector(".submenu");
                if (submenu) submenu.style.display = "none";
              }}
            >
              <a href={link.href} style={linkStyle}>
                {link.text}
              </a>
              {link.submenu && link.submenu.length > 0 && (
                <div className="submenu" style={submenuStyle}>
                  {link.submenu.map((sublink, subIndex) => (
                    <a
                      key={subIndex}
                      href={sublink.href}
                      style={{
                        ...linkStyle,
                        display: "block",
                        padding: "5px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sublink.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {props.showSearch && (
            <input
              type="text"
              placeholder={props.searchPlaceholder || "Search..."}
              style={{
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          )}

          {props.showSignIn && (
            <a
              href={props.signInLink || "/signin"}
              style={{
                color: props.signInTextColor || props.navLinkColor || "#333",
                textDecoration: "none",
                marginLeft: "10px",
              }}
            >
              {props.signInText || "Sign In"}
            </a>
          )}

          {props.showSignUp && (
            <a
              href={props.signUpLink || "/signup"}
              style={{
                backgroundColor: props.signUpBgColor || "#007bff",
                color: props.signUpTextColor || "#ffffff",
                padding: "8px 16px",
                borderRadius: "4px",
                textDecoration: "none",
                marginLeft: "10px",
              }}
            >
              {props.signUpText || "Sign Up"}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderBlock;
