import { RxFace } from 'react-icons/rx';
import { SVGLoader } from './SVGLoader';




const industryOptions = [
	{ value: 'technology', label: 'Technology' },
	{ value: 'healthcare', label: 'Healthcare' },
	{ value: 'finance', label: 'Finance' },
	{ value: 'education', label: 'Education' },
	{ value: 'retail', label: 'Retail' },
	{ value: 'manufacturing', label: 'Manufacturing' },
	{ value: 'consulting', label: 'Consulting' },
	{ value: 'real-estate', label: 'Real Estate' },
	{ value: 'legal', label: 'Legal' },
	{ value: 'marketing', label: 'Marketing' },
	{ value: 'nonprofit', label: 'Non-profit' },
	{ value: 'other', label: 'Other' },
];



// NoRecordFound
const NoRecordFound = ({ colSpan, asTable = true }: { colSpan?: number; asTable?: boolean }) => {
	const content = (
		<div className="center-content flex flex-col justify-center items-center h-full">
			<RxFace className="w-16 h-16" color={'var(--text-primary)'} />
			<p
				id="mt-3 !underline-none"
				style={{ color: 'var(--text-primary)' }}>
				No record found
			</p>
		</div>
	);

	if (!asTable) {
		return <div className="h-[300px] p-0 m-auto">{content}</div>;
	}

	return (
		<tr>
			<td colSpan={colSpan} className="h-[300px] p-0 m-auto border-b-0">
				{content}
			</td>
		</tr>
	);
};

// SVGLoader Fetch
const SVGLoaderFetch = ({ colSpan, text, asTable = true }: { colSpan?: number; text: string; asTable?: boolean }) => {
	const content = (
		<div className="center-content flex flex-col justify-center items-center h-full">
			<SVGLoader width={"40px"} height={"40px"} color={"var(--text-primary)"} />
			<p className="mt-3">{text}</p>
		</div>
	);

	if (!asTable) {
		return <div className="h-[300px] p-0 m-auto">{content}</div>;
	}

	return (
		<tr>
			<td colSpan={colSpan} className="h-[300px] p-0 m-auto">
				{content}
			</td>
		</tr>
	);
};




export {
	industryOptions,
	NoRecordFound,
	SVGLoaderFetch,
};