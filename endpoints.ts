
import { ILRequest, ILResponse, ILApplication, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { send_error, send_ok, typed_dict } from "../../liwe/utils";
import { locale_load } from '../../liwe/locale';

import { perms } from '../../liwe/auth';

import {
	post_category_admin_add, patch_category_admin_update, patch_category_admin_fields, get_category_admin_list, delete_category_admin_del, post_category_admin_module_add, delete_category_admin_module_del, get_category_list, get_category_top_list, category_db_init
} from './methods';

import {
	Category, CategorySmallItem, CategoryTreeItem
} from './types';

/*=== d2r_start __header ===*/

/*=== d2r_end __header ===*/

/* === CATEGORY API === */
export const init = ( liwe: ILiWE ) => {
	const app = liwe.app;

	console.log( "    - Category " );

	liwe.cfg.app.languages.map( ( l ) => locale_load( "category", l ) );
	category_db_init ( liwe );


	app.post ( "/api/category/admin/add", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { title, slug, id_parent, description, modules, top, visible, image, ___errors } = typed_dict( req.fields, [
			{ name: "title", type: "string", required: true },
			{ name: "slug", type: "string", required: true },
			{ name: "id_parent", type: "string" },
			{ name: "description", type: "string" },
			{ name: "modules", type: "string[]" },
			{ name: "top", type: "boolean" },
			{ name: "visible", type: "boolean" },
			{ name: "image", type: "string" }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		post_category_admin_add ( req,title, slug, id_parent, description, modules, top, visible, image,  ( err: ILError, category: Category ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { category } );
		} );
	} );

	app.patch ( "/api/category/admin/update", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, id_parent, title, slug, description, modules, top, visible, image, ___errors } = typed_dict( req.fields, [
			{ name: "id", type: "string", required: true },
			{ name: "id_parent", type: "string" },
			{ name: "title", type: "string" },
			{ name: "slug", type: "string" },
			{ name: "description", type: "string" },
			{ name: "modules", type: "string[]" },
			{ name: "top", type: "boolean" },
			{ name: "visible", type: "boolean" },
			{ name: "image", type: "string" }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		patch_category_admin_update ( req,id, id_parent, title, slug, description, modules, top, visible, image,  ( err: ILError, category: Category ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { category } );
		} );
	} );

	app.patch ( "/api/category/admin/fields", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, data, ___errors } = typed_dict( req.fields, [
			{ name: "id", type: "string", required: true },
			{ name: "data", type: "any", required: true }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		patch_category_admin_fields ( req,id, data,  ( err: ILError, category: Category ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { category } );
		} );
	} );

	app.get ( "/api/category/admin/list", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { parent_only, ___errors } = typed_dict( req.query as any, [
			{ name: "parent_only", type: "boolean" }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		get_category_admin_list ( req,parent_only,  ( err: ILError, categories: Category[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { categories } );
		} );
	} );

	app.delete ( "/api/category/admin/del", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, ___errors } = typed_dict( req.fields, [
			{ name: "id", type: "string", required: true }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		delete_category_admin_del ( req,id,  ( err: ILError, ids: string[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { ids } );
		} );
	} );

	app.post ( "/api/category/admin/module/add", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, module, ___errors } = typed_dict( req.fields, [
			{ name: "id", type: "string", required: true },
			{ name: "module", type: "string", required: true }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		post_category_admin_module_add ( req,id, module,  ( err: ILError, category: Category ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { category } );
		} );
	} );

	app.delete ( "/api/category/admin/module/del", perms( [ "category.editor" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { id, module, ___errors } = typed_dict( req.fields, [
			{ name: "id", type: "string", required: true },
			{ name: "module", type: "string", required: true }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		delete_category_admin_module_del ( req,id, module,  ( err: ILError, category: Category ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { category } );
		} );
	} );

	app.get ( "/api/category/list", ( req: ILRequest, res: ILResponse ) => {
		const { id_category, module, ___errors } = typed_dict( req.query as any, [
			{ name: "id_category", type: "string" },
			{ name: "module", type: "string" }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		get_category_list ( req,id_category, module,  ( err: ILError, tree: CategoryTreeItem ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { tree } );
		} );
	} );

	app.get ( "/api/category/top/list", ( req: ILRequest, res: ILResponse ) => {
		const { module, limit, ___errors } = typed_dict( req.query as any, [
			{ name: "module", type: "string" },
			{ name: "limit", type: "number" }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Parameters error: ${___errors.join ( ', ' )}` } );

		get_category_top_list ( req,module, limit,  ( err: ILError, categs: CategorySmallItem[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { categs } );
		} );
	} );

}
