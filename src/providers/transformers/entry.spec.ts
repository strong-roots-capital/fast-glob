import * as assert from 'assert';
import * as path from 'path';

import Settings, { Options } from '../../settings';
import * as tests from '../../tests/index';
import { EntryTransformerFunction } from '../../types';
import * as utils from '../../utils/index';
import EntryTransformer from './entry';

function getEntryTransformerInstance(options?: Options): EntryTransformer {
	return new EntryTransformer(new Settings(options));
}

function getTransformer(options?: Options): EntryTransformerFunction {
	return getEntryTransformerInstance(options).getTransformer();
}

describe('Providers → Transformers → Entry', () => {
	describe('Constructor', () => {
		it('should create instance of class', () => {
			const filter = getEntryTransformerInstance();

			assert.ok(filter instanceof EntryTransformer);
		});
	});

	describe('.getFilter', () => {
		it('should return transformed entry as string when options is not provided', () => {
			const transformer = getTransformer();
			const entry = tests.getFileEntry();

			const expected = 'fixtures/file.txt';

			const actual = transformer(entry);

			assert.strictEqual(actual, expected);
		});

		it('should return transformed entry as object when the `stats` option is enabled', () => {
			const transformer = getTransformer({ stats: true });
			const entry = tests.getFileEntry();

			const expected = entry;

			const actual = transformer(entry);

			assert.deepEqual(actual, expected);
		});

		it('should apply custom transform function', () => {
			const transformer = getTransformer({ transform: () => 'cake' });
			const entry = tests.getFileEntry();

			const expected = 'cake';

			const actual = transformer(entry);

			assert.strictEqual(actual, expected);
		});

		it('should return entry with absolute filepath when the `absolute` option is enabled', () => {
			const transformer = getTransformer({ absolute: true });
			const entry = tests.getFileEntry();

			const fullpath = path.join(process.cwd(), 'fixtures', 'file.txt');
			const expected = utils.path.unixify(fullpath);

			const actual = transformer(entry);

			assert.strictEqual(actual, expected);
		});

		it('should return entry with trailing slash when the `markDirectories` is enabled', () => {
			const transformer = getTransformer({ markDirectories: true });
			const entry = tests.getDirectoryEntry();

			const expected = 'fixtures/directory/';

			const actual = transformer(entry);

			assert.strictEqual(actual, expected);
		});

		it('should return correct entry when the `absolute` and `markDirectories` options is enabled', () => {
			const transformer = getTransformer({ absolute: true, markDirectories: true });
			const entry = tests.getDirectoryEntry();

			const fullpath = path.join(process.cwd(), 'fixtures', 'directory', '/');
			const expected = utils.path.unixify(fullpath);

			const actual = transformer(entry);

			assert.strictEqual(actual, expected);
		});
	});
});
