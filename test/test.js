'use strict';

const testFixture = require('test-fixture');
const fse = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const assert = require('assert');

const {
    dereferenceSchema,
    materializeSchemaVersion,
} = require('../index.js');



const tests = [
    {
        name: 'should materialize new yaml version from file with symlink',
        schemaPath: 'schemas/basic/current.yaml',
        options: {
            shouldSymlink: true,
            contentTypes: ['yaml'],
            shouldGitAdd: false,
        },
        expected: {
            materializedPaths: ['schemas/basic/1.2.0.yaml', 'schemas/basic/1.2.0'],
            symlinkPath: 'schemas/basic/1.2.0',
        },
    },
    {
        name: 'should materialize new yaml version from file without symlink',
        schemaPath: 'schemas/basic/current.yaml',
        options: {
            shouldSymlink: false,
            contentTypes: ['yaml'],
            shouldGitAdd: false,
        },
        expected: {
            materializedPaths: ['schemas/basic/1.2.0.yaml'],
            symlinkPath: 'schemas/basic/1.2.0',
        },
    },
    {
        name: 'should materialize new json version from file with symlink',
        schemaPath: 'schemas/basic/current.yaml',
        options: {
            shouldSymlink: true,
            contentTypes: ['json'],
            shouldGitAdd: false,
        },
        expected: {
            materializedPaths: ['schemas/basic/1.2.0.json', 'schemas/basic/1.2.0'],
            symlinkPath: 'schemas/basic/1.2.0',
        },
    },
    {
        name: 'should materialize new json version from file without symlink',
        schemaPath: 'schemas/basic/current.yaml',
        options: {
            shouldSymlink: false,
            contentTypes: ['json'],
            shouldGitAdd: false,
        },
        expected: {
            materializedPaths: ['schemas/basic/1.2.0.json'],
            symlinkPath: 'schemas/basic/1.2.0',
        },
    },

    {
        name: 'should materialize new yaml and json version from file with symlink',
        schemaPath: 'schemas/basic/current.yaml',
        options: {
            shouldSymlink: true,
            contentTypes: ['json', 'yaml'],
            shouldGitAdd: false,
        },
        expected: {
            materializedPaths: ['schemas/basic/1.2.0.json', 'schemas/basic/1.2.0.yaml', 'schemas/basic/1.2.0'],
            symlinkPath: 'schemas/basic/1.2.0',
        },
    },
];

describe('materializeSchemaVersion', function() {
    let fixture;
    beforeEach('Copying fixtures to temp directory', async function() {
        // Copy the fixtures/ dir into a temp directory that is automatically
        // cleaned up after each test.
        fixture = testFixture();
        await fixture.copy();
    });

    tests.forEach((test) => {
        it(test.name, async function() {
            const schemaFile = fixture.resolve(test.schemaPath);
            const schemaDirectory = path.dirname(schemaFile);
            const schema = yaml.safeLoad(await fse.readFile(schemaFile, 'utf-8'));

            const materializedFiles = await materializeSchemaVersion(
                schemaDirectory, schema, test.options
            );

            assert.deepStrictEqual(
                materializedFiles.sort(),
                test.expected.materializedPaths.sort().map(p => fixture.resolve(p))
            );

            assert.equal(
                await fse.exists(fixture.resolve(test.expected.symlinkPath)),
                test.options.shouldSymlink
            );
            if (test.shouldSymlink) {
                assert.equal(
                    // The symlink should point at the first
                    // contentType listed in contentTypes.
                    await fse.realpath(test.expected.symlinkPath),
                    test.expected.materializedPaths[0]
                );
            }
        });
    });
});


describe('dereferenceSchema', function() {
    let fixture;
    beforeEach('Copying fixtures to temp directory', async function() {
        // Copy the fixtures/ dir into a temp directory that is automatically
        // cleaned up after each test.
        fixture = testFixture();
        await fixture.copy();
    });

    it('should dereference TODO', function() {
        dereferenceSchema();
        assert.ok(true);
    });

});
