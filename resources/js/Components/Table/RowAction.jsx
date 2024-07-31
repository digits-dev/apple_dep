import { Link } from "@inertiajs/react";
import React from "react";
import EyeIcon from "./Icons/EyeIcon";
import AddIcon from "./Icons/AddIcon";
import EditIcon from "./Icons/EditIcon";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const RowAction = ({ action, size, href, onClick, disabled = false, type = 'link', tooltipContent }) => {
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

	const button = (
		<button
			className="relative active:scale-105 transition-all hover:before:-top-1/4 hover:before:-left-1/4 hover:before:content-[''] hover:before:block hover:before:absolute hover:before:bg-black/10 hover:before:h-[150%] hover:before:w-[150%] hover:before:rounded-full"
			onClick={onClick}
			disabled={disabled}
		>
			{icon}
		</button>
	);

	const link = (
		<Link
			className="relative active:scale-105 transition-all hover:before:-top-1/4 hover:before:-left-1/4 hover:before:content-[''] hover:before:block hover:before:absolute hover:before:bg-black/10 hover:before:h-[150%] hover:before:w-[150%] hover:before:rounded-full"
			as="button"
			href={href}
			onClick={(e) => {
				if (disabled) e.preventDefault(); 	
			}}
		>
			{icon}
		</Link>
	);

	return (
		<>
			{tooltipContent ? (
				<Tippy content={<span dangerouslySetInnerHTML={{ __html: tooltipContent }} />} allowHTML={true}>
					{type === 'button' ? button : link}
				</Tippy>
			) : (
				type === 'button' ? button : link
			)}
		</>
	);
};

export default RowAction;
