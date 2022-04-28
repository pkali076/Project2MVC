const helper = require('./helper.js');

const handleBlog = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#blogName').value;
    const text = e.target.querySelector('#blogText').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !text){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, text, _csrf}, loadBlogsFromServer);

    return false;
}

const BlogForm = (props) => {
    return(
        <section class="section">
        <div class="container">
          <div class="columns">
            <div class="column is-5-tablet" id="makeBlog"></div>
                <form id="blogForm"
                    onSubmit={handleBlog}
                    name="blogForm"
                    action="/maker"
                    method="POST"
                    className="blogForm"
                    >
                        <div class="field">
                        <label class="label" htmlFor="name">Blog Name: </label>
                        <input class="input is-primary is-normal is-primary" id="blogName" type="text" name="name" placeholder="Blog Name" />
                        <label class="label" htmlFor="text">Blog Text: </label>
                        <textarea class="textarea is-primary" id="blogText" type="text" name="text" placeholder="Blog Text" rows="15"></textarea>
                        <input class="input" id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                        <button class="button is-primary is-medium" className="makeBlogSubmit" type="submit" value="Make Blog" >Make Blog</button>
                        </div> 
                    </form>      
                </div>
            </div>
        </section>
    );
}


const BlogList = (props) => {
    if(props.blogs.length === 0){
        return (
            <div className="blogList">
                <h3 className="emptyBlog">No blogs on your account yet -- Feel free to get writing!</h3>
            </div>
        );
    }
    
    const blogNodes = props.blogs.map(blog => {
        return(
            <section class="section">
                <div class="container">
                    <div class="columns">
                        <div class="column is-5-tablet" key={blog._id} className="blog">
                            <div class="message">
                                <div class="message-header">
                                    <p className="blogName"> Blog Name: {blog.name} </p>
                                </div>
                                <div class="message-body">
                                    <p className="blogText"> Blog Text: {blog.text} </p>
                                </div>
                            </div> 
                        </div>
                     </div>
                </div>
            </section>
        );
    });

    return(
        <div className="blogList">
            {blogNodes}
            </div>
    );
}
//<img src="/assets/img/blog.png" alt="blog alt" className="blogFace" />
const loadBlogsFromServer = async () => {
    const response = await fetch('/getBlogs');
    const data = await response.json();
    ReactDOM.render(
        <BlogList blogs={data.blogs} />,
        document.getElementById('blogs')
    );
}

const ChangePasswordWindow = (props) => {
    return(
        <section class="section">
            <div class="container">
                <div class="columns">
        <form id="changePassForm"
        name="changePassForm"
        onSubmit={handlePassChange}
        action="/passChange"
        method="POST"
        className="mainForm">
            <div class="field">
                <label class="label" htmlFor="oldPass">Old Password: </label>
                <input class="input" id="oldPass" type="password" name="oldPass" placeholder="current password" />
                <label class="label" htmlFor="newPass">New Password: </label>
                <input class="input" id="newPass" type="password" name="newPass" placeholder="retype new password" />
                <input class="input" id="_csrf" type="hidden" name="_csrf" value="{props.csrf}" />
                <button class="button is-primary is-medium" className="formSubmit" type="submit" value="Change Password" >Change Password</button>
                </div> </form></div></div></section>
    );
}

const handlePassChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector("#oldPass").value;
    const newPass = e.target.querySelector("#newPass").value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!oldPass || !newPass){
        helper.handleError('One of the Passwords is Empty!');
        return false;

    }
    helper.sendPost(e.target.action, {oldPass, newPass, _csrf});

    return false;
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const passChangeButton = document.getElementById('passChangeButtonTest');

    passChangeButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<ChangePasswordWindow csrf={data.csrfToken} />,
            document.getElementById('changePasswordID'));
        return false;
    });

    const burgerIcon = document.querySelector("#burger");
    const navbarMenu = document.querySelector("#nav-links");

    burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
    });

    ReactDOM.render(
        <BlogForm csrf={data.csrfToken} />,
        document.getElementById('makeBlog')
    );

    ReactDOM.render(
        <BlogList blogs={[]} />,
        document.getElementById('blogs')
    );

    loadBlogsFromServer();
}

window.onload = init;