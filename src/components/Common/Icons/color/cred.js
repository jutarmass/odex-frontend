import React from 'react';

const SvgCred = props => (
  <svg width={props.width || 64} height={props.height || 64} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx={16} cy={16} fill="#37e8a3" r={16} />
      <path
        d="M12.136 15.966l3.482 3.493 9.13-9.191L26 11.538 15.618 22l-4.735-4.763zm2.11-.31L19.864 10l1.253 1.27-5.617 5.66zm-2.276 4.83l-1.236 1.246L6 16.97l1.251-1.27z"
        fill="#fff"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export default SvgCred;
