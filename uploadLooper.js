/**
 * Created by mkahn on 3/7/17.
 */

var fs = require( 'fs' );
var _ = require( 'lodash' );
var path = require( 'path' );
var Promise = require( 'bluebird' );
var request = require( 'superagent-bluebird-promise' );

var FILE_PATH = '/Users/mkahn/Pictures/Kayaking';
var MAX_COUNT = 100;

function getYoungestFile( folder ) {


    return new Promise( function ( resolve, reject ) {
        "use strict";
        var justFiles;

        fs.readdir( folder, function ( err, files ) {

            if (err)
                reject(err);

            justFiles = [];
            files.forEach( function ( f ) {
                var stats = fs.statSync( path.join( folder, f ) );
                if ( stats.isFile() && f.indexOf('ticket')==-1 )
                    justFiles.push( { name: path.join( folder, f ), bd: stats.mtime } );
            } );

            // justFiles.sort( function ( a, b ) {
            //
            //     var atime = new Date( a.bd ).getTime();
            //     var btime = new Date( b.bd ).getTime();
            //
            //     if ( atime < btime )
            //         return 1;
            //     if ( atime > btime )
            //         return -1;
            //
            //     return 0;
            //
            // } );

            resolve( _.sample(justFiles).name );

        })


    } );
}

function doit(){

    getYoungestFile( FILE_PATH  )
        .then( function ( f ) {
            console.log( f );
            request
                .post( 'http://104.236.184.69/api/v2/media/upload' )
                .attach( 'file', f )
                .then( function ( res ) {

                    console.log( "Posted Media!" );
                } )
                .catch( function ( err ) {

                    console.log( "Did not post!" );

                } )
                .finally( function(){
                    MAX_COUNT--;
                    console.log('Maxcount is '+MAX_COUNT);
                    if (MAX_COUNT)
                        setTimeout(doit, 5*60*1000);
                })
        } );

}

setTimeout(doit, 1000);
