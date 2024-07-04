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
			<button className="relative active:scale-105 transition-all hover:before:-top-1/4 hover:before:-left-1/4 hover:before:content-[''] hover:before:block hover:before:absolute hover:before:bg-black/10 hover:before:h-[150%] hover:before:w-[150%] hover:before:rounded-full " onClick={onClick}>
				{icon}
			</button> 
		: 
		<Link
			className="relative active:scale-105 transition-all hover:before:-top-1/4 hover:before:-left-1/4 hover:before:content-[''] hover:before:block hover:before:absolute hover:before:bg-black/10 hover:before:h-[150%] hover:before:w-[150%] hover:before:rounded-full"
			as="button"
			href={href}
		>
			{icon}
		</Link>}
	</>
	);
};

export default RowAction;
