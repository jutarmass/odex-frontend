import React from 'react';

const SvgMaid = props => (
  <svg width={props.width || 64} height={props.height || 64} {...props}>
    <g fill="#FFF" fillRule="evenodd">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zM9.291 19.333l10.955 6.308c2.263-1.282 3.394-1.692 3.394-5.436V7.59c-2.263-1.282-3.189-2.052-6.429-.205L6.257 13.692c0 2.564-.206 3.744 3.034 5.641zm8.234-5.108v2.854l-2.488-1.427 2.488-1.427z" />
      <path
        fillRule="nonzero"
        d="M17.52 20.205L6.257 13.692l10.954-6.307c3.24-1.847 4.166-1.077 6.429.205l-11.263 6.513 5.143 2.974v3.128z"
        opacity={0.402}
      />
      <path
        fillOpacity={0.8}
        fillRule="nonzero"
        d="M20.246 12.667V25.64L9.29 19.333c-3.24-1.897-3.034-3.077-3.034-5.64l11.263 6.512v-5.949l2.726-1.59z"
      />
    </g>
  </svg>
);

export default SvgMaid;
