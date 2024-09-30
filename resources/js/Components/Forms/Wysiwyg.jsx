import React from 'react'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FormatLabelName from "../../Utilities/FormatLabelName";

const Wysiwyg = ({placeholder, value, onChange, theme = 'snow', displayName, name }) => {
    

    const modules = {
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']                                         // remove formatting button
        ]
      };
  return (
    <>
        <label
            htmlFor={name}
            className="block text-sm font-bold text-gray-700 font-nunito-sans mb-2"
        >
            {displayName || FormatLabelName(name)}
        </label>
        <ReactQuill
            className='mb-2'
            name={name}        
            value={value}
            onChange={onChange}
            modules={modules} 
            theme={theme} // or bubble
            placeholder={placeholder}
        />
    </>
  )
}

export default Wysiwyg