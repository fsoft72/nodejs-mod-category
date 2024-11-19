/* Types file generated by flow2code */

/*=== f2c_start __file ===*/

/*=== f2c_end __file ===*/
/** Category */
export interface Category {
	/** the main id field */
	id: string;
	/** The Domain name */
	domain: string;
	/** If the category is a "sub category", the id_parent contains the id of the Category container */
	id_parent: string;
	/** User that created this category (and it is defined as 'owner') */
	id_owner: string;
	/** A true / false flag defining if the current category is actually a folder */
	is_folder: boolean;
	/** Category name */
	title: string;
	/** Category description */
	description: string;
	/** Category image id */
	image: string;
	/** Category slug */
	slug: string;
	/** If the category is visible */
	visible: boolean;
	/** This is a top category */
	top: boolean;
	/** tags for the type */
	modules: string[];
}

export const CategoryKeys = {
	'id': { type: 'string', priv: false },
	'domain': { type: 'string', priv: false },
	'id_parent': { type: 'string', priv: false },
	'id_owner': { type: 'string', priv: false },
	'is_folder': { type: 'boolean', priv: false },
	'title': { type: 'string', priv: false },
	'description': { type: 'string', priv: false },
	'image': { type: 'string', priv: false },
	'slug': { type: 'string', priv: false },
	'visible': { type: 'boolean', priv: false },
	'top': { type: 'boolean', priv: false },
	'modules': { type: 'string[]', priv: false },
};

/** CategoryTreeItem */
export interface CategoryTreeItem {
	/** the main id field */
	id: string;
	/** If the category is a "sub category", the id_parent contains the id of the Category container */
	id_parent: string;
	/** User that created this category (and it is defined as 'owner') */
	id_owner: string;
	/** A true / false flag defining if the current category is actually a folder */
	is_folder: boolean;
	top?: boolean;
	/** Category name */
	title: string;
	/** Category description */
	description: string;
	/** Category image */
	image: string;
	/** the children of this Tree Item */
	children: CategoryTreeItem[];
	/** Slug */
	slug: string;
	/** Flag T/F for category visibility */
	visible: boolean;
	/** Category modules */
	modules?: string[];
}

export const CategoryTreeItemKeys = {
	'id': { type: 'string', priv: false },
	'id_parent': { type: 'string', priv: false },
	'id_owner': { type: 'string', priv: false },
	'is_folder': { type: 'boolean', priv: false },
	'top': { type: 'boolean', priv: false },
	'title': { type: 'string', priv: false },
	'description': { type: 'string', priv: false },
	'image': { type: 'string', priv: false },
	'children': { type: 'CategoryTreeItem[]', priv: false },
	'slug': { type: 'string', priv: false },
	'visible': { type: 'boolean', priv: false },
	'modules': { type: 'string[]', priv: false },
};

/** CategorySmallItem */
export interface CategorySmallItem {
	/** the main id field */
	id: string;
	/** Category name */
	title: string;
	/** Category description */
	description: string;
	/** Category image */
	image: string;
}

export const CategorySmallItemKeys = {
	'id': { type: 'string', priv: false },
	'title': { type: 'string', priv: false },
	'description': { type: 'string', priv: false },
	'image': { type: 'string', priv: false },
};

