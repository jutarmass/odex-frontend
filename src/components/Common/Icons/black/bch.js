import React from 'react';

const SvgBch = props => (
  <svg width={props.width || 64} height={props.height || 64} {...props}>
    <path
      d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm5.236-21.309c-.777-1.972-2.722-2.15-4.988-1.71l-.807-2.813-1.712.491.785 2.74c-.45.128-.907.269-1.362.41l-.79-2.758-1.712.49.806 2.813c-.369.114-.73.225-1.086.327l-.002-.008-2.362.676.525 1.829s1.257-.387 1.243-.357c.693-.2 1.035.139 1.2.467l.92 3.205c.047-.013.11-.03.184-.04l-.181.052 1.287 4.49c.032.227.003.612-.481.752.027.013-1.245.356-1.245.356l.246 2.143 2.229-.64c.414-.118.824-.228 1.226-.34l.816 2.845 1.71-.49-.806-2.815a65.74 65.74 0 0 0 1.371-.38l.803 2.803 1.712-.491-.813-2.84c2.831-.991 4.638-2.294 4.113-5.07-.422-2.234-1.725-2.912-3.472-2.836.848-.79 1.214-1.859.643-3.301zm-.651 6.77c.61 2.127-3.1 2.929-4.26 3.263l-1.08-3.77c1.16-.333 4.704-1.71 5.34.508zm-2.322-5.09c.554 1.935-2.547 2.58-3.513 2.857l-.98-3.419c.966-.277 3.914-1.455 4.493.562z"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgBch;
