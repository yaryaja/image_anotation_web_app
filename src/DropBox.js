import { useDropzone } from 'react-dropzone';

import styled from 'styled-components';

const getColor = (props) => {
	if (props.isDragAccept) {
		return '#00e676';
	}
	if (props.isDragReject) {
		return '#ff1744';
	}
	if (props.isFocused) {
		return '#2196f3';
	}
	return '#eeeeee';
};

const annotationOptions = [
	'airplane',
	'automobile',
	'bird',
	'cat',
	'deer',
	'dog',
	'frog',
	'horse',
	'ship',
	'truck',
];

const Container = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40px;
	border-width: 2px;
	border-radius: 10px;
	border-color: ${(props) => getColor(props)};
	border-style: dashed;
	background-color: #fafafa;
	color: black;
	font-weight: bold;
	font-size: 1.4rem;
	outline: none;
	transition: border 0.24s ease-in-out;
`;


function DropBox({ onDrop, anotation, setAnotation }) {

	const handleAnnotationChange = (event, filePath) => {
		const { value } = event.target;
		setAnotation((prevAnnotations) => ({
			...prevAnnotations,
			[filePath]: value,
		}));
	};

	const {
		getRootProps,
		getInputProps,
		acceptedFiles,
		open,
		isDragAccept,
		isFocused,
		isDragReject,
	} = useDropzone({
		accept: 'image/*',
		onDrop,
		noClick: true,
		noKeyboard: true,
	});




	const lists = acceptedFiles.map((file) => (
		<li key={file.path}>
			<span>{file.path} - {file.size} bytes</span>
			<select
				id={`annotation-${file.path}`}

				value={anotation[file.path] || ''}
				onChange={(e) => handleAnnotationChange(e, file.path)}
			>
				<option value="" disabled>
					Select annotation
				</option>
				{annotationOptions.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</li>
	));


	return (
		<>
			{' '}
			<section className="dropbox">
				<Container
					className="dropbox"
					{...getRootProps({ isDragAccept, isFocused, isDragReject })}
				>
					<input {...getInputProps()} />
					<p>Drag 'n' drop some files here</p>
					<button type="button" className="btn" onClick={open}>
						Click to select file
					</button>
				</Container>
			</section>
			<aside>
				<h4>Selected Images</h4>
				<p>{lists}</p>
			</aside>
		</>
	);
}

export default DropBox;