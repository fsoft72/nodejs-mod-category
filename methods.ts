
import { ILRequest, ILResponse, LCback, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { collection_add, collection_find_all, collection_find_one, collection_find_one_dict, collection_find_all_dict, collection_del_one_dict, collection_del_all_dict, collection_init, mkid, prepare_filters } from '../../liwe/arangodb';
import { DocumentCollection } from 'arangojs/collection';

import {
	Category, CategoryKeys, CategorySmallItem, CategorySmallItemKeys, CategoryTreeItem, CategoryTreeItemKeys
} from './types';

let _liwe: ILiWE = null;

let _coll_categories: DocumentCollection = null;

const COLL_CATEGORIES = "categories";

/*=== d2r_start __file_header === */
import { keys_valid, list_add, list_del, set_attr } from '../../liwe/utils';
import { system_domain_get_by_session } from '../system/methods';
import { upload_info } from '../../liwe/upload';
import { public_fullpath } from '../../liwe/liwe';
import { mkdir, rm } from '../../liwe/fs';
import { resize } from '../../liwe/image';

const category_get = async ( req: ILRequest, id?: string, slug?: string ): Promise<Category> => {
	if ( !id && !slug ) return null;

	return await collection_find_one_dict( req.db, 'categories', { id, slug } );
};

const _add_module = ( c: Category, mod: string ) => {
	c.modules = list_add( c.modules, mod );
	return c;
};

const _del_module = ( c: Category, mod: string ) => {
	c.modules = list_del( c.modules, mod );

	return c;
};

const _slug_valid = async ( req: ILRequest, slug: string, err: any, id?: string ) => {
	const cg: Category = await category_get( req, null, slug );
	if ( !cg ) return true;

	if ( cg.id != id ) {
		err.message = 'Slug already in use';
		return false;
	}

	return true;
};

const _slug_transform = ( slug: string ) => {
	if ( !slug ) slug = "";

	return slug.replace( /[^a-zA-Z0-9_-]/g, '-' ).replace( /--+/g, '-' ).toLowerCase();
};

/*
const _move_category_image = async ( req: ILRequest, c: Category ) => {
	const u2 = upload_info( req, 'image' );
	if ( !u2 ) return;

	const base_dest_path = public_fullpath( 'academy/category/cover' );
	const fname = `${ mkid( `categ` ) }.${ u2.ext }`;

	mkdir( base_dest_path );

	await resize( u2.path, `${ base_dest_path }/${ fname }`, 320, 0 );
	rm( u2.path );

	c.image = fname;
};
*/
/*=== d2r_end __file_header ===*/

// {{{ post_category_admin_add ( req: ILRequest, title: string, slug: string, id_parent?: string, description?: string, modules?: string[], top?: boolean, visible: boolean = true, image?: string, cback: LCBack = null ): Promise<Category>
/**
 * Add or modify a Category to the system
 *
 * @param title - Category title [req]
 * @param slug - Category slug [req]
 * @param id_parent - the parent Category (if any) [opt]
 * @param description - Category description [opt]
 * @param modules - The Module(s) the category is included [opt]
 * @param top - Flag T/F if Category is a TOP category [opt]
 * @param visible - Flag T/F for category visibility [opt]
 * @param image - The category image [opt]
 *
 */
export const post_category_admin_add = ( req: ILRequest, title: string, slug: string, id_parent?: string, description?: string, modules?: string[], top?: boolean, visible: boolean = true, image?: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start post_category_admin_add ===*/
		const err = { message: 'Category not found' };

		if ( !id_parent ) id_parent = "";
		if ( !modules ) modules = [];

		slug = _slug_transform( slug );

		if ( await _slug_valid( req, slug, err ) == false )
			return cback ? cback( err ) : reject( err );

		const domain = await system_domain_get_by_session( req );

		let categ: Category = { is_folder: false, id: mkid( 'category' ), title, description, modules: [], id_owner: req.user.id, id_parent, domain: domain.code, visible, slug, top, image };

		modules.forEach( ( m ) => _add_module( categ, m ) );

		if ( id_parent ) {
			const parent: Category = await category_get( req, id_parent );
			if ( !parent ) return cback ? cback( err ) : reject( err );
			parent.is_folder = true;
			await collection_add( _coll_categories, parent );
		}

		// await _move_category_image( req, categ );

		categ = await collection_add( _coll_categories, categ, false, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== d2r_end post_category_admin_add ===*/
	} );
};
// }}}

// {{{ patch_category_admin_update ( req: ILRequest, id: string, id_parent?: string, title?: string, slug?: string, description?: string, modules?: string[], top?: boolean, visible?: boolean, image?: string, cback: LCBack = null ): Promise<Category>
/**
 * Updates a catagory
 *
 * @param id - the Category ID to update [req]
 * @param id_parent - the parent Category (if any) [opt]
 * @param title - Category title [opt]
 * @param slug - Category slug [opt]
 * @param description - Category description [opt]
 * @param modules - The Module(s) the category is included [opt]
 * @param top - Flag T/F if Category is a TOP category [opt]
 * @param visible - If the category is visible or not [opt]
 * @param image - The category image [opt]
 *
 */
export const patch_category_admin_update = ( req: ILRequest, id: string, id_parent?: string, title?: string, slug?: string, description?: string, modules?: string[], top?: boolean, visible?: boolean, image?: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start patch_category_admin_update ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );

		if ( !categ ) return cback ? cback( err ) : reject( err );

		if ( slug ) {
			slug = _slug_transform( slug );
			if ( await _slug_valid( req, slug, err, id ) == false )
				return cback ? cback( err ) : reject( err );
		}

		categ = { ...categ, ...keys_valid( { id_parent, title, description, modules, visible, slug, top, image } ) };
		// await _move_category_image( req, categ );
		categ = await collection_add( _coll_categories, categ, false, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== d2r_end patch_category_admin_update ===*/
	} );
};
// }}}

// {{{ patch_category_admin_fields ( req: ILRequest, id: string, data: any, cback: LCBack = null ): Promise<Category>
/**
 * Modifies a single field
 *
 * @param id - The post ID [req]
 * @param data - The field / value to patch [req]
 *
 */
export const patch_category_admin_fields = ( req: ILRequest, id: string, data: any, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start patch_category_admin_fields ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		if ( data.slug ) {
			data.slug = _slug_transform( data.slug );
			if ( await _slug_valid( req, data.slug, err, id ) == false )
				return cback ? cback( err ) : reject( err );
		}

		categ = { ...categ, ...keys_valid( data ) };
		categ = await collection_add( _coll_categories, categ, false, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== d2r_end patch_category_admin_fields ===*/
	} );
};
// }}}

// {{{ get_category_admin_list ( req: ILRequest, parent_only?: boolean, cback: LCBack = null ): Promise<Category[]>
/**
 * List all categories
 *
 * @param parent_only - If T, returns only the first level categories [opt]
 *
 */
export const get_category_admin_list = ( req: ILRequest, parent_only?: boolean, cback: LCback = null ): Promise<Category[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_category_admin_list ===*/
		const domain = await system_domain_get_by_session( req );
		const conds = parent_only ? { domain: domain.code, id_parent: { mode: 'null', name: 'id_parent' } } : { domain: domain.code };

		const res = await collection_find_all_dict( req.db, COLL_CATEGORIES, conds, CategoryKeys );

		return cback ? cback( null, res ) : resolve( res );
		/*=== d2r_end get_category_admin_list ===*/
	} );
};
// }}}

// {{{ delete_category_admin_del ( req: ILRequest, id: string, cback: LCBack = null ): Promise<string[]>
/**
 * Deletes a Category
 *
 * @param id - Ths ID category to be deleted [req]
 *
 */
export const delete_category_admin_del = ( req: ILRequest, id: string, cback: LCback = null ): Promise<string[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start delete_category_admin_del ===*/
		await collection_del_one_dict( req.db, 'categories', { id } );

		// FIXME: if category had a parent, we should update the parent too
		let subs: any = await collection_find_all_dict( req.db, COLL_CATEGORIES, { id_parent: id } );
		if ( !subs ) subs = [];
		await _coll_categories.removeAll( subs );

		const res = subs.map( ( s: any ) => s.id );
		res.push( id );

		return cback ? cback( null, res ) : resolve( res );
		/*=== d2r_end delete_category_admin_del ===*/
	} );
};
// }}}

// {{{ post_category_admin_module_add ( req: ILRequest, id: string, module: string, cback: LCBack = null ): Promise<Category>
/**
 * Adds a new module to a category
 *
 * @param id - the Category ID to update [req]
 * @param module - The module to add [req]
 *
 */
export const post_category_admin_module_add = ( req: ILRequest, id: string, module: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start post_category_admin_module_add ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		_add_module( categ, module );

		categ = await collection_add( _coll_categories, categ, false, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== d2r_end post_category_admin_module_add ===*/
	} );
};
// }}}

// {{{ delete_category_admin_module_del ( req: ILRequest, id: string, module: string, cback: LCBack = null ): Promise<Category>
/**
 * Deletes a module to a category
 *
 * @param id - the Category ID to update [req]
 * @param module - The module to add [req]
 *
 */
export const delete_category_admin_module_del = ( req: ILRequest, id: string, module: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start delete_category_admin_module_del ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		_del_module( categ, module );

		categ = await collection_add( _coll_categories, categ, false, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== d2r_end delete_category_admin_module_del ===*/
	} );
};
// }}}

// {{{ get_category_list ( req: ILRequest, id_category?: string, module?: string, cback: LCBack = null ): Promise<CategoryTreeItem>
/**
 * Returns the categories as a tree
 *
 * @param id_category - The starting id_category [opt]
 * @param module - The starting module [opt]
 *
 */
export const get_category_list = ( req: ILRequest, id_category?: string, module?: string, cback: LCback = null ): Promise<CategoryTreeItem> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_category_list ===*/
		const [ filters, values ] = prepare_filters( 'doc', {
			module: {
				name: 'modules',
				val: module,
				mode: 'm'
			}, id: id_category
		} );

		const categs = await collection_find_all( req.db, `FOR doc IN categories
  SORT doc.title
  ${ filters }

  LET children = (
    FOR s IN categories
      SORT s.title
      FILTER s.id_parent == doc.id
      RETURN { id: s.id, title: s.title, id_parent: s.id_parent }
  )
  RETURN MERGE ( { id: doc.id, title: doc.title, id_parent: doc.id_parent, is_folder: doc.is_folder, modules: doc.modules }, { children } )`, values );

		if ( !categs.length ) return cback ? cback( null, null ) : resolve( null );

		const res = categs.filter( ( cat: Category ) => cat.id_parent == '' );

		return cback ? cback( null, res ) : resolve( res as any );
		/*=== d2r_end get_category_list ===*/
	} );
};
// }}}

// {{{ get_category_top_list ( req: ILRequest, module?: string, limit?: number, cback: LCBack = null ): Promise<CategorySmallItem[]>
/**
 * Returns the Top categories
 *
 * @param module - The starting module [opt]
 * @param limit - Maximum number of categories to return [opt]
 *
 */
export const get_category_top_list = ( req: ILRequest, module?: string, limit?: number, cback: LCback = null ): Promise<CategorySmallItem[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_category_top_list ===*/
		const csi: CategorySmallItem[] = await collection_find_all_dict( req.db, COLL_CATEGORIES, { module, top: true }, CategorySmallItemKeys,
			{ sort: [ { field: 'title' } ], rows: limit } );

		return cback ? cback( null, csi ) : resolve( csi );
		/*=== d2r_end get_category_top_list ===*/
	} );
};
// }}}


/**
 * Initializes user module database
 *
 * @param liwe - LiWE full config [req]
 *
 */
export const category_db_init = ( liwe: ILiWE, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		_liwe = liwe;

		_coll_categories = await collection_init( liwe.db, COLL_CATEGORIES, [
			{ type: "persistent", fields: [ "id" ], unique: true },
			{ type: "persistent", fields: [ "domain" ], unique: false },
			{ type: "persistent", fields: [ "id_parent" ], unique: false },
			{ type: "persistent", fields: [ "id_owner" ], unique: false },
			{ type: "persistent", fields: [ "is_folder" ], unique: false },
			{ type: "persistent", fields: [ "slug" ], unique: true },
			{ type: "persistent", fields: [ "visible" ], unique: false },
			{ type: "persistent", fields: [ "top" ], unique: false },
			{ type: "persistent", fields: [ "modules[*]" ], unique: false },
		], false );

		/*=== d2r_start category_db_init ===*/
		return cback ? cback( null, true ) : resolve( true );
		/*=== d2r_end category_db_init ===*/
	} );
};
