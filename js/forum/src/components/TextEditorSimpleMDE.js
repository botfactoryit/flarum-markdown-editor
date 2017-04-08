/* global $ */
/* global m */

import TextEditor from 'flarum/components/TextEditor';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import listItems from 'flarum/helpers/listItems';

export default class TextEditorSimpleMDE extends TextEditor {
    init() {
        this.value = m.prop(this.props.value || '');
        this.loading = false;
        m.redraw(true);
    }

    view() {
        return (
            <div className="TextEditor TextEditor-SimpleMDE">
                {this.loading ?
                    (
                        <p className="TextEditor-placeholder">
                            {LoadingIndicator.component({size: 'large'})}
                        </p>
                    ) :
                    (
                        <div>
                            <div>
                                <textarea config={this.configTextarea.bind(this)} class="TextEditor-Container"></textarea>
                            </div>
                            <ul className="TextEditor-controls Composer-footer">
                                {listItems(this.controlItems().toArray())}
                            </ul>
                        </div>
                    )}
            </div>
        );
    }

    configTextarea(element, isInitialized) {
        if (isInitialized) return;
        this.simpleMDE = new SimpleMDE({
            element: element,
            spellChecker : false,
            lineWrapping: true,
            placeholder : this.props.placeholder,
            toolbar: [
                {
                    name: "bold",
                    action: () => this.simpleMDE.toggleBold(),
                    className: "fa fa-bold",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.bold'),
                },
                {
                    name: "italic",
                    action: () => this.simpleMDE.toggleItalic(),
                    className: "fa fa-italic",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.italic'),
                },
                {
                    name: "heading",
                    action: () => this.simpleMDE.toggleHeadingSmaller(),
                    className: "fa fa-header",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.heading'),
                },
                '|',
                {
                    name: "quote",
                    action: () => this.simpleMDE.toggleBlockquote(),
                    className: "fa fa-quote-left",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.quote'),
                },
                {
                    name: "unordered-list",
                    action: () => this.simpleMDE.toggleUnorderedList(),
                    className: "fa fa-list-ul",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.unordered_list'),
                },
                {
                    name: "ordered-list",
                    action: () => this.simpleMDE.toggleOrderedList(),
                    className: "fa fa-list-ol",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.ordered_list'),
                },
                '|',
                {
                    name: "link",
                    action: () => this.simpleMDE.drawLink(),
                    className: "fa fa-link",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.link'),
                },
                {
                    name: "image",
                    action: () => this.simpleMDE.drawImage(),
                    className: "fa fa-picture-o",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.image'),
                },
                '|',
                {
                    name: "guide",
                    action: "https://s9etextformatter.readthedocs.io/Plugins/Litedown/Syntax/",
                    className: "fa fa-question-circle",
                    title: app.translator.trans('ogioncz-mdeditor.forum.toolbar.guide'),
                },
            ],
        })
        this.editorInited(this.simpleMDE);
    }

    getEditor() {
        return this.simpleMDE;
    }

    editorInited(editor) {
        editor.value(this.value());
        const onChange = () => {
            this.oninput(editor.value());
        };
        editor.codemirror.on('change', onChange);
    }

    setValue(value) {
        this.simpleMDE.value(value);
    }

    onunload() {
        const editor = this.simpleMDE();
        if (editor) {
            editor.toTextArea();
            this.simpleMDE = null;
        }
        super.onunload();
    }
    onsubmit() {
        const editor = this.simpleMDE;
        if (editor) {
            this.oninput(editor.value());
        }
        super.onsubmit();
    }
}
