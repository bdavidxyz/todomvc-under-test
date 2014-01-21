/*global describe*/
/*global it*/
/*global browser*/
/*global expect*/
/*global repeater*/
/*global jQueryFunction*/
/*jslint node: true */
/*global element */
/*global lastRequest */
/*global ROOT_URL */
/*global activateXHRlog */
/*global sleep */
/*global pause */
/*global fireEnterOn */
/*global QueryString */
/*global windowLocalStorage */

"use strict";


describe('Starting application', function() {

    describe('No todos', function() {

        it('Should NOT display main section when there are no item', function() {
            // set up
            browser().navigateTo("/tests/root/frameworkundertest/" + QueryString.fw + "/index.html");

            //ensure the page is displayed
            expect(repeater('section#todoapp').count()).toEqual(1);

            //toggle-all inside main section should not be visible
            expect(element('#toggle-all:visible').count()).toBe(0);
        });
        it('Should NOT display footer section when there are no item', function() {
            expect(repeater('section#todoapp').count()).toEqual(1);
            expect(element('footer#footer:visible').count()).toBe(0);
        });
    });
    describe('New todo', function() {
        it('Should display a section with input to add a new todo', function() {
            // set up
            expect(repeater('input#new-todo').count()).toEqual(1);
            expect(element('input#new-todo:visible').count()).toBe(1);
        });
        it('Should create a new todo on enter, clearing input text, adding it to the list', function() {
            jQueryFunction('input#new-todo', 'val', 'a first todo');
            jQueryFunction('input#new-todo', 'change');

            fireEnterOn('input#new-todo');

            expect(element('input#new-todo').val()).toBe('');
            expect(element('section#main:visible').count()).toBe(1);
            expect(element('ul#todo-list > li').count()).toBe(1);
            expect(element('#todo-list label:eq(0)').text()).toBe('a first todo');
        });
        it('Should trim() the text when adding a new todo', function() {
            jQueryFunction('input#new-todo', 'val', ' a second todo ');
            jQueryFunction('input#new-todo', 'change');
            fireEnterOn('input#new-todo');
            expect(element('ul#todo-list > li').count()).toBe(2);
            expect(element('#todo-list  label:eq(1)').text()).toBe('a second todo');

        });
        it('Should display main and footer if todo list is NOT empty', function() {
            expect(element('footer#footer:visible').count()).toBe(1);
            expect(element('footer#footer:visible').count()).toBe(1);

        });
    });
    describe('Item', function() {
        it("Clicking the checkbox strikethrough the todo and toggling the class completed on it's parent <li>", function() {
            expect(element('li.completed').count()).toBe(0);
            expect(element('#todo-list label:eq(0)').css("text-decoration")).not().toContain('line-through');

            jQueryFunction('#todo-list input:eq(0)', 'click');
            expect(element('li.completed').count()).toBe(1);
            expect(element('#todo-list  label:eq(0)').css("text-decoration")).toContain('line-through');
        });
        it("Should NOT display the delete button by default", function() {
            expect(element('button.destroy').count()).toBe(2);
            expect(element('button.destroy:visible').count()).toBe(0);
        });
        it("Double clicking the label activates the editing mode, and toggle .editing class on it's <li>", function() {
            // arrange & check first
            expect(element('ul#todo-list > li:eq(0) > input').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0) > input.edit:visible').count()).toBe(0);
            expect(element('ul#todo-list > li:eq(0) > input.edit:focus').count()).toBe(0);
            expect(element('ul#todo-list > li:eq(0).editing').count()).toBe(0);

            // act
            jQueryFunction('#todo-list label:eq(0)', 'dblclick');

            // assert
            expect(element('ul#todo-list > li:eq(0) > input.edit:visible').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0).editing').count()).toBe(1);
        });

    });
    describe('Editing', function() {
        it("Should set the focus on the edited element", function() {
            expect(element('ul#todo-list > li:eq(0) > input.edit:focus').count()).toBe(1);
        });
        it("Should be able to save new value on enter", function() {
            expect(element('ul#todo-list > li:eq(0) > input.edit').count()).toBe(1);
            jQueryFunction('ul#todo-list > li:eq(0) > input.edit', 'val', ' changeValueOnEnter ');
            jQueryFunction('ul#todo-list > li:eq(0) > input.edit', 'change');

            // blur
            fireEnterOn('ul#todo-list > li:eq(0) > input.edit');

            // new value saved contains text entered
            expect(element('#todo-list label:eq(0)').text()).toContain('changeValueOnEnter');
        });
        it("new entered value should be trimmed", function() {
            // new value saved is exactly equals to the trimmed text.
            expect(element('#todo-list label:eq(0)').text()).toBe('changeValueOnEnter');
        });
        it("editing class should be removed", function() {
            expect(element('#todo-list > li:eq(0)').count()).toBe(1);
            expect(element('#todo-list > li:eq(0).editing').count()).toBe(0);
        });
    });
    describe('Mark all as complete', function() {
        it('Should mark all as complete', function() {
            expect(element('input.toggle:checked').count()).toBe(1);
            expect(element('input#toggle-all:checked').count()).toBe(0);
            jQueryFunction('#toggle-all', 'click');

            expect(element('input.toggle:checked').count()).toBe(2);
            expect(element('input#toggle-all:checked').count()).toBe(1);
        });
       it('Should un-mark all as complete', function() {
           expect(element('input.toggle:checked').count()).toBe(2);
           expect(element('input#toggle-all:checked').count()).toBe(1);
           jQueryFunction('#toggle-all', 'click');

           // the
           expect(element('input.toggle:checked').count()).toBe(0);
           expect(element('input#toggle-all:checked').count()).toBe(0);
        });
        it('Should toggle if todos are one by one checked as complete', function() {
            expect(element('input.toggle:checked').count()).toBe(0);
            expect(element('input#toggle-all:checked').count()).toBe(0);

            jQueryFunction('input.toggle:eq(0)', 'click');
            jQueryFunction('input.toggle:eq(1)', 'click');

            expect(element('input.toggle:checked').count()).toBe(2);
            expect(element('input#toggle-all:checked').count()).toBe(1);

        });
        it('Should toggle if todos are one by one checked as un-complete', function() {
            expect(element('input.toggle:checked').count()).toBe(2);
            expect(element('input#toggle-all:checked').count()).toBe(1);

            jQueryFunction('input.toggle:eq(0)', 'click');
            jQueryFunction('input.toggle:eq(1)', 'click');

            expect(element('input.toggle:checked').count()).toBe(0);
            expect(element('input#toggle-all:checked').count()).toBe(0);
        });
    });
    describe('Counter', function() {
        it('Should pluralize item word when there is more than one item left', function() {
            expect(element('#todo-count').text()).toContain("2");
            expect(element('#todo-count').text()).toContain("items");
            expect(element('#todo-count').text()).toContain("left");
        });
        it('Should NOT pluralize item word when there is EXACTLY one item left', function() {
            jQueryFunction('input.toggle:eq(0)', 'click');
            expect(element('#todo-count').text()).toContain("1");
            expect(element('#todo-count').text()).toContain("item");
            expect(element('#todo-count').text()).toContain("left");
        });
        it('Should write number in a strong way', function() {
            expect(element('#todo-count strong').count()).toBe(1);
        });
    });
    describe('Routing', function() {
        it('Should have an "active" route that shows active todos', function() {
            expect(element('ul#todo-list > li:visible').count()).toBe(2);
            expect(element('li.completed:visible').count()).toBe(1);
            jQueryFunction('a:contains("Active")', 'click');
            expect(element('ul#todo-list > li:visible').count()).toBe(1);
            expect(element('#todo-list  label:visible').css("text-decoration")).not().toContain('line-through');
        });

        it('Should have a "normal" route that shows all todos', function() {
            jQueryFunction('a:contains("All")', 'click');
            expect(element('ul#todo-list > li:visible').count()).toBe(2);
            expect(element('li.completed:visible').count()).toBe(1);
        });
        it('Should have a "completed" route that shows completed todos', function() {
            jQueryFunction('a:contains("Completed")', 'click');
            expect(element('ul#todo-list > li:visible').count()).toBe(1);
            expect(element('#todo-list  label:visible').css("text-decoration")).toContain('line-through');

            //restore all todos
            jQueryFunction('a:contains("All")', 'click');
        });
    });
    describe('Clear completed button', function() {
        it('Display the number of completed todos', function() {
            expect(element('#clear-completed').text()).toContain("Clear");
            expect(element('#clear-completed').text()).toContain("completed");
            expect(element('#clear-completed').text()).toContain("(1)");
        });
        it('Should remove completed todos when clicked', function() {
            expect(element('#clear-completed:visible').count()).toBe(1);
            expect(element('input.toggle').count()).toBe(2);
            jQueryFunction('#clear-completed', 'click');
            expect(element('input.toggle').count()).toBe(1);
        });
        it('Should be hidden when there are no completed TODOs', function() {
            expect(element('input.toggle').count()).toBe(1);
            expect(element('#clear-completed:visible').count()).toBe(0);
        });
    });
    describe('Persistence', function() {
        it('Should have todo-[frameworkname] in the localstorage', function() {
            expect(windowLocalStorage("todos-" + QueryString.fw).getItem()).not().toBe(null);
        });
        it('Should have id, title and completed fields, but NOT editing field', function() {
            expect(windowLocalStorage("todos-" + QueryString.fw).getItem()).toContain("completed");
            expect(windowLocalStorage("todos-" + QueryString.fw).getItem()).toContain("title");
            expect(windowLocalStorage("todos-" + QueryString.fw).getItem()).toContain("id");
            expect(windowLocalStorage("todos-" + QueryString.fw).getItem()).not().toContain("editing");
        });
    });
    describe('Deletion', function() {
        it('Should delete item when click on delete', function() {
            expect(element('input.toggle').count()).toBe(1);
            jQueryFunction('button.destroy:eq(0)', 'click');
            expect(element('input.toggle').count()).toBe(0);

        });
    });
});