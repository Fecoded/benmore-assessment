export const LoaderIcon = ({
	width = "61px",
	height = "61px",
}: {
	width?: string;
	height?: string;
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={{ margin: "auto", background: "none", display: "block", shapeRendering: "auto" }}
		width={width}
		height={height}
		viewBox="0 0 100 100"
		preserveAspectRatio="xMidYMid"
		data-testid="loader-icon"
	>
		<circle
			cx="50"
			cy="50"
			r="35"
			strokeWidth="8"
			stroke="#3498db"
			strokeDasharray="54.97787143782138 54.97787143782138"
			fill="none"
			strokeLinecap="round"
		>
			<animateTransform
				attributeName="transform"
				type="rotate"
				repeatCount="indefinite"
				dur="1.4925373134328357s"
				keyTimes="0;1"
				values="0 50 50;360 50 50"
			></animateTransform>
		</circle>
	</svg>
);