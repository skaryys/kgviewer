const defaults = {

	neo4j: {
		initialQuery: `MATCH (n) RETURN (n)`,
		neo4jUri: 'bolt://localhost:7687',
		neo4jUser: 'neo4j',
		neo4jPassword: 'neo4j',
		encrypted: 'ENCRYPTION_OFF',
		trust: 'TRUST_ALL_CERTIFICATES'
	},

	visjs: {
		interaction: {
			hover: false,
			hoverConnectedEdges: false,
			selectConnectedEdges: false,
			multiselect: 'alwaysOn',
			zoomView: false,
			experimental: {}
		},
		physics: {
			barnesHut: {
				damping: 0.1
			}
		},
		nodes: {
		  color: "#ff2a10",
			mass: 4,
			shape: 'neo',
			labelHighlightBold: false,
			widthConstraint: {
				maximum: 40
			},
			heightConstraint: {
				maximum: 40
			}
		},
		edges: {
		  length: 600,
			hoverWidth: 0,
			selectionWidth: 0,
			font: {
				size: 14,
				strokeWidth: 0,
				align: 'top'
			},
			color: {
				inherit: false
			},
			arrows: {
				to: {
					enabled: true,
					type: 'arrow',
					scaleFactor: 0.5
				}
			},
		}

	}
};

export { defaults };
