/*
 * This file has been generated by flow2code
 * See: https://flow.liwe.org
 */

import { ILRequest, ILResponse, LCback, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { $l } from '../../liwe/locale';
import { system_permissions_register } from '../system/methods';

import {
	Category, CategoryKeys, CategorySmallItem, CategorySmallItemKeys, CategoryTreeItem,
	CategoryTreeItemKeys,
} from './types';

import _module_perms from './perms';

let _liwe: ILiWE = null;

const _ = ( txt: string, vals: any = null, plural = false ) => {
	return $l( txt, vals, plural, "category" );
};

const COLL_CATEGORIES = "categories";

/*=== f2c_start __file_header === */
import { keys_valid, list_add, list_del, mkid, set_attr } from '../../liwe/utils';
import { system_domain_get_by_session } from '../system/methods';
// import { upload_set_filename } from '../upload/methods';
import { adb_collection_init, adb_record_add, adb_query_all, adb_find_one, adb_find_all, adb_del_one, adb_prepare_filters, adb_del_all } from '../../liwe/db/arango';

export const CATEGORY_EMPTY_ID = "EMPTY_ID";

export const category_get = async ( req: ILRequest, id?: string, slug?: string ): Promise<Category> => {
	if ( !id && !slug ) return null;

	return await adb_find_one( req.db, 'categories', { id, slug } );
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
/*=== f2c_end __file_header ===*/

// {{{ post_category_admin_add ( req: ILRequest, title: string, slug: string, id_parent?: string, description?: string, modules?: string[], top?: boolean, visible: boolean = true, image?: string, cback: LCBack = null ): Promise<Category>
/**
 *
 * The call creates a category inside the system.
 * This function returns the full `Category` structure
 *
 * @param title - Category title [req]
 * @param slug - Category slug [req]
 * @param id_parent - the parent Category (if any) [opt]
 * @param description - Category description [opt]
 * @param modules - The Module(s) the category is included in [opt]
 * @param top - Flag T/F if Category is a TOP category [opt]
 * @param visible - Flag T/F for category visibility [opt]
 * @param image - The category image [opt]
 *
 * @return category: Category
 *
 */
export const post_category_admin_add = ( req: ILRequest, title: string, slug: string, id_parent?: string, description?: string, modules?: string[], top?: boolean, visible: boolean = true, image?: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start post_category_admin_add ===*/
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
			await adb_record_add( req.db, COLL_CATEGORIES, parent );
		}

		// await _move_category_image( req, categ );

		// if ( image ) categ = await upload_set_filename( categ, "image", "image_url" );

		categ = await adb_record_add( req.db, COLL_CATEGORIES, categ, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== f2c_end post_category_admin_add ===*/
	} );
};
// }}}

// {{{ patch_category_admin_update ( req: ILRequest, id: string, id_parent?: string, title?: string, slug?: string, description?: string, modules?: string[], top?: boolean, visible?: boolean, image?: string, cback: LCBack = null ): Promise<Category>
/**
 *
 * The call updates a category inside the system.
 * This function returns the full `Category` structure
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
 * @return category: Category
 *
 */
export const patch_category_admin_update = ( req: ILRequest, id: string, id_parent?: string, title?: string, slug?: string, description?: string, modules?: string[], top?: boolean, visible?: boolean, image?: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start patch_category_admin_update ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );

		if ( !categ ) return cback ? cback( err ) : reject( err );

		if ( slug ) {
			slug = _slug_transform( slug );
			if ( await _slug_valid( req, slug, err, id ) == false ) {
				err.message = 'Slug already in use';
				return cback ? cback( err ) : reject( err );
			}
		}

		categ = { ...categ, ...keys_valid( { id_parent, title, description, modules, visible, slug, top, image } ) };
		// if ( image ) categ = await upload_set_filename( categ, "image", "image_url" );
		categ = await adb_record_add( req.db, COLL_CATEGORIES, categ, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== f2c_end patch_category_admin_update ===*/
	} );
};
// }}}

// {{{ patch_category_admin_fields ( req: ILRequest, id: string, data: any, cback: LCBack = null ): Promise<Category>
/**
 *
 * The call modifies a single field.
 * This function returns the full `Category` structure
 *
 * @param id - The category ID [req]
 * @param data - The field / value to patch [req]
 *
 * @return category: Category
 *
 */
export const patch_category_admin_fields = ( req: ILRequest, id: string, data: any, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start patch_category_admin_fields ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		if ( data.slug ) {
			data.slug = _slug_transform( data.slug );
			if ( await _slug_valid( req, data.slug, err, id ) == false )
				return cback ? cback( err ) : reject( err );
		}

		categ = { ...categ, ...keys_valid( data ) };
		// if ( data.image ) categ = await upload_set_filename( categ, "image", "image_url" );
		categ = await adb_record_add( req.db, COLL_CATEGORIES, categ, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== f2c_end patch_category_admin_fields ===*/
	} );
};
// }}}

// {{{ get_category_admin_list ( req: ILRequest, parent_only?: boolean, cback: LCBack = null ): Promise<Category[]>
/**
 *
 * The call lists all categories in the system.
 * This function returns the full `Category[]` structure
 *
 * @param parent_only - If T, returns only the first level categories [opt]
 *
 * @return categories: Category
 *
 */
export const get_category_admin_list = ( req: ILRequest, parent_only?: boolean, cback: LCback = null ): Promise<Category[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_category_admin_list ===*/
		const domain = await system_domain_get_by_session( req );
		const conds = parent_only ? { domain: domain.code, id_parent: { mode: 'null', name: 'id_parent' } } : { domain: domain.code };

		const res = await adb_find_all( req.db, COLL_CATEGORIES, conds, CategoryKeys, { sort: [ { field: 'title' } ] } );

		return cback ? cback( null, res ) : resolve( res );
		/*=== f2c_end get_category_admin_list ===*/
	} );
};
// }}}

// {{{ delete_category_admin_del ( req: ILRequest, id: string, cback: LCBack = null ): Promise<string>
/**
 *
 * This call deletes a category. If the category contains sub categories, all sub categories will be deleted as well, recursively.
 *
 * @param id - Ths ID category to be deleted [req]
 *
 * @return id: string
 *
 */
export const delete_category_admin_del = ( req: ILRequest, id: string, cback: LCback = null ): Promise<string> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start delete_category_admin_del ===*/
		await adb_del_one( req.db, 'categories', { id } );

		// FIXME: if category had a parent, we should update the parent too


		const res = await adb_del_all( req.db, COLL_CATEGORIES, { id_parent: id } );

		/*
		let subs: any = await adb_find_all( req.db, COLL_CATEGORIES, { id_parent: id } );
		if ( !subs ) subs = [];
		await _coll_categories.removeAll( subs );

		const res = subs.map( ( s: any ) => s.id );
		res.push( id );
		*/

		return cback ? cback( null, id ) : resolve( id );
		/*=== f2c_end delete_category_admin_del ===*/
	} );
};
// }}}

// {{{ post_category_admin_module_add ( req: ILRequest, id: string, module: string, cback: LCBack = null ): Promise<Category>
/**
 *
 * The call updates a category adding a new module.
 * This function returns the full `Category` structure
 *
 * @param id - the Category ID to update [req]
 * @param module - The module to add [req]
 *
 * @return category: Category
 *
 */
export const post_category_admin_module_add = ( req: ILRequest, id: string, module: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start post_category_admin_module_add ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		_add_module( categ, module );

		categ = await adb_record_add( req.db, COLL_CATEGORIES, categ, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== f2c_end post_category_admin_module_add ===*/
	} );
};
// }}}

// {{{ delete_category_admin_module_del ( req: ILRequest, id: string, module: string, cback: LCBack = null ): Promise<Category>
/**
 *
 * The call updates a category deleting a new module.
 * This function returns the full `Category` structure
 *
 * @param id - the Category ID to update [req]
 * @param module - The module to be removed [req]
 *
 * @return category: Category
 *
 */
export const delete_category_admin_module_del = ( req: ILRequest, id: string, module: string, cback: LCback = null ): Promise<Category> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start delete_category_admin_module_del ===*/
		const err = { message: 'Category not found' };
		let categ: Category = await category_get( req, id );
		if ( !categ ) return cback ? cback( err ) : reject( err );

		_del_module( categ, module );

		categ = await adb_record_add( req.db, COLL_CATEGORIES, categ, CategoryKeys );

		return cback ? cback( null, categ ) : resolve( categ );
		/*=== f2c_end delete_category_admin_module_del ===*/
	} );
};
// }}}

// {{{ get_category_list ( req: ILRequest, id_category?: string, module?: string, cback: LCBack = null ): Promise<CategoryTreeItem>
/**
 *
 * This endpoint returns all the categories as a tree
 *
 * @param id_category - The starting id_category [opt]
 * @param module - The starting module [opt]
 *
 * @return tree: CategoryTreeItem
 *
 */
export const get_category_list = ( req: ILRequest, id_category?: string, module?: string, cback: LCback = null ): Promise<CategoryTreeItem> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_category_list ===*/
		const [ filters, values ] = adb_prepare_filters( 'doc', {
			module: {
				name: 'modules',
				val: [ module ],
				mode: 'a'
			}, id: id_category
		} );

		const categs = await adb_query_all( req.db, `FOR doc IN categories
  SORT doc.title
  ${ filters }

  LET children = (
    FOR s IN categories
      SORT s.title
      FILTER s.id_parent == doc.id
      RETURN { id: s.id, title: s.title, id_parent: s.id_parent, slug: s.slug, modules: s.modules, visible: s.visible, top: s.top }
  )
  RETURN MERGE ( {
  	id: doc.id,
	title: doc.title,
	id_parent: doc.id_parent,
	is_folder: doc.is_folder,
	modules: doc.modules,
	slug: doc.slug,
	top: doc.top,
	visible: doc.visible
}, { children } )`, values );

		if ( !categs.length ) return cback ? cback( null, null ) : resolve( null );

		const res = categs.filter( ( cat: Category ) => cat.id_parent == '' );

		return cback ? cback( null, res ) : resolve( res as any );
		/*=== f2c_end get_category_list ===*/
	} );
};
// }}}

// {{{ get_category_top_list ( req: ILRequest, module?: string, limit?: number, cback: LCBack = null ): Promise<CategorySmallItem[]>
/**
 *
 * This endpoint returns all the top categories (parent)
 *
 * @param module - The starting module [opt]
 * @param limit - Maximum number of categories to return [opt]
 *
 * @return categs: CategorySmallItem
 *
 */
export const get_category_top_list = ( req: ILRequest, module?: string, limit?: number, cback: LCback = null ): Promise<CategorySmallItem[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start get_category_top_list ===*/
		const csi: CategorySmallItem[] = await adb_find_all( req.db, COLL_CATEGORIES, { modules: [ module ], top: true }, CategorySmallItemKeys,
			{ sort: [ { field: 'title' } ], rows: limit } );

		return cback ? cback( null, csi ) : resolve( csi );
		/*=== f2c_end get_category_top_list ===*/
	} );
};
// }}}

// {{{ post_category_slug_valid ( req: ILRequest, slug: string, id?: string, cback: LCBack = null ): Promise<boolean>
/**
 *
 * @param slug - The slug to check [req]
 * @param id - The ID category (if exists) [opt]
 *
 * @return ok: boolean
 *
 */
export const post_category_slug_valid = ( req: ILRequest, slug: string, id?: string, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== f2c_start post_category_slug_valid ===*/
		const err = {};
		const res = await _slug_valid( req, slug, err, id );

		if ( res == false ) return cback ? cback( err ) : reject( err );

		return cback ? cback( null, res ) : resolve( res );
		/*=== f2c_end post_category_slug_valid ===*/
	} );
};
// }}}

// {{{ category_db_init ( liwe: ILiWE, cback: LCBack = null ): Promise<boolean>
/**
 *
 * Initializes the module's database
 *
 * @param liwe - The Liwe object [req]
 *
 * @return : boolean
 *
 */
export const category_db_init = ( liwe: ILiWE, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		_liwe = liwe;

		system_permissions_register( 'category', _module_perms );

		await adb_collection_init( liwe.db, COLL_CATEGORIES, [
			{ type: "persistent", fields: [ "id" ], unique: true },
			{ type: "persistent", fields: [ "domain" ], unique: false },
			{ type: "persistent", fields: [ "id_parent" ], unique: false },
			{ type: "persistent", fields: [ "id_owner" ], unique: false },
			{ type: "persistent", fields: [ "is_folder" ], unique: false },
			{ type: "persistent", fields: [ "slug" ], unique: true },
			{ type: "persistent", fields: [ "visible" ], unique: false },
			{ type: "persistent", fields: [ "top" ], unique: false },
			{ type: "persistent", fields: [ "modules[*]" ], unique: false },
		], { drop: false } );

		/*=== f2c_start category_db_init ===*/
		const cat = await category_get( { db: liwe.db } as ILRequest, 'EMPTY_ID' );
		if ( !cat ) {
			await adb_record_add( liwe.db, COLL_CATEGORIES, {
				id: CATEGORY_EMPTY_ID,
				title: 'no category',
				id_parent: '', is_folder: false,
				modules: [],
				slug: '__empty__', visible: true, top: true, domain: '', id_owner: '', created: new Date()
			} );
		}

		return cback ? cback( null, true ) : resolve( true );
		/*=== f2c_end category_db_init ===*/
	} );
};
// }}}


