const externalCjsToEsmPlugin = external => ({
	name: 'external',
	setup(build) {
		const escape = text => `^${text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`;
		const filter = new RegExp(external.map(escape).join('|'));
		build.onResolve({ filter: /.*/, namespace: 'external' }, args => ({
			path: args.path, external: true
		}));
		build.onResolve({ filter }, args => ({
			path: args.path, namespace: 'external'
		}));
		build.onLoad({ filter: /.*/, namespace: 'external' }, args => ({
			contents: `import * as ns from ${JSON.stringify(args.path)}; module.exports = ns`
		}));
	}
});

const opt = {
	platform: 'node',
	format: 'esm',
	entryPoints: [`src/index2.mjs`],
	bundle: true,
	outfile: `dist/index2.mjs`,
	mainFields: ['module', 'main'],
	external: [...require('module').builtinModules],
	plugins: [externalCjsToEsmPlugin([...require('module').builtinModules])]
};

require('esbuild').build(opt).catch(() => process.exit(1));
