import { Link } from "@inertiajs/react";
import React from "react";
import EyeIcon from "./Icons/EyeIcon";
import AddIcon from "./Icons/AddIcon";
import EditIcon from "./Icons/EditIcon";

const RowAction = ({ action, size, href, onClick, type = 'link'}) => {
	const iconSize = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	}[size];

	const icon = {
		view: <EyeIcon classes={iconSize} />,
		add: <AddIcon classes={iconSize} />,
		edit: <EditIcon classes={iconSize} />,
	}[action];

	return (
	<>
		{type == 'button' ? 	
			<button className="hover:bg-black/10 rounded-md p-0.5 active:scale-105" onClick={onClick}>
				{icon}
			</button> 
		: 
		<Link
			className="hover:bg-black/10 rounded-md p-0.5 active:scale-105"
			as="button"
			href={href}
		>
			{icon}
		</Link>}
	</>
	);
};

export default RowAction;
