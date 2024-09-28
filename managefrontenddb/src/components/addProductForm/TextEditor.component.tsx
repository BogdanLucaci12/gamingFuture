import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TextEditorProps={
    onChange: (text: string) => void;
    resetValue:boolean,
    value:string
}

const TextEditor = ({ onChange, resetValue, value }:TextEditorProps) => {
    const [editorContent, setEditorContent] = useState<string>('');

    const handleEditorChange = (content: string) => {
        //for every change store that hange in editorContext then sent back to parent
        setEditorContent(content);
        onChange(content)
    };
    
    useEffect(()=>{
        //set text data in text editor
        setEditorContent(value)
    }, [value])

    useEffect(()=>{
        //insert an empty string in editor to clean the data inside him
        setEditorContent('')
    }, [resetValue])
  return (
          <ReactQuill
              value={editorContent}
              onChange={handleEditorChange}
              modules={TextEditor.modules}
              formats={TextEditor.formats}
              className='h-96 mb-20'
          />
  );
};

TextEditor.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],  
        [{ 'size': ['small', false, 'large', 'huge'] }], 
        [{ 'color': [] }, { 'background': [] }],   
        [{ 'align': [] }],
        ['clean']  
    ]
};

TextEditor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align',
    'color', 'background'
];

export default TextEditor;