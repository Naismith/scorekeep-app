import { GlobalStyles } from "@mui/material";

export const GlobalStylesOverrides = (
  <GlobalStyles
    styles={`
    html, body, #root {
        height: 100%;
    }

    #root {
        display: flex;
        flex-direction: column;
    }
`}
  />
);
