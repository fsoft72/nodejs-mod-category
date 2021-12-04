/*=== d2r_start __header === */

/*=== d2r_end __header ===*/

/** Category */
export interface Category {
	/** The unique category ID */
	id?: string;
	/** The Domain name */
	domain?: string;
	/** If the category is a "sub category", the id_parent contains the id of the Category container */
	id_parent?: string;
	/** User that created this category (and it is defined as 'owner') */
	id_owner?: string;
	/** A true / false flag defining if the current category is actually a folder */
	is_folder?: boolean;
	/** Category name */
	title?: string;
	/** Category description */
	description?: string;
	/** Category ID */
	image?: string;
	/** Category image URL */
	image_url?: string;
	/** Category slug */
	slug?: string;
	/** If the category is visible */
	visible?: boolean;
	/** This is a top category */
	top?: boolean;
	/** Modules */
	modules?: string[];
}

export const CategoryKeys = {
	'id': { type: 'string', priv: false },
	'domain': { type: 'string', priv: true },
	'id_parent': { type: 'string', priv: false },
	'id_owner': { type: 'string', priv: false },
	'is_folder': { type: 'boolean', priv: false },
	'title': { type: 'string', priv: false },
	'description': { type: 'string', priv: false },
	'image': { type: 'string', priv: false },
	'image_url': { type: 'string', priv: false },
	'slug': { type: 'string', priv: false },
	'visible': { type: 'boolean', priv: false },
	'top': { type: 'boolean', priv: false },
	'modules': { type: 'string[]', priv: false },
};

/** CategoryTreeItem */
export interface CategoryTreeItem {
	/** The unique category ID item */
	id?: string;
	/** If the category is a "sub category", the id_parent contains the id of the Category container */
	id_parent?: string;
	/** User that created this category (and it is defined as 'owner') */
	id_owner?: string;
	/** A true / false flag defining if the current category is actually a folder */
	is_folder?: boolean;
	/** name */
	title?: any;
	/** description */
	description?: any;
	/** image */
	image?: any;
	/** image URL */
	image_url?: any;
	/** the children of this Tree Item */
	children?: Category[];
}

export const CategoryTreeItemKeys = {
	'id': { type: 'string', priv: false },
	'id_parent': { type: 'string', priv: false },
	'id_owner': { type: 'string', priv: false },
	'is_folder': { type: 'boolean', priv: false },
	'title': { type: 'any', priv: false },
	'description': { type: 'any', priv: false },
	'image': { type: 'any', priv: false },
	'image_url': { type: 'any', priv: false },
	'children': { type: 'Category[]', priv: false },
};

/** CategorySmallItem */
export interface CategorySmallItem {
	/** The unique category ID item */
	id?: string;
	/** name */
	title?: any;
	/** description */
	description?: any;
	/** image */
	image?: any;
	/** image URL */
	image_url?: any;
}

export const CategorySmallItemKeys = {
	'id': { type: 'string', priv: false },
	'title': { type: 'any', priv: false },
	'description': { type: 'any', priv: false },
	'image': { type: 'any', priv: false },
	'image_url': { type: 'any', priv: false },
};

