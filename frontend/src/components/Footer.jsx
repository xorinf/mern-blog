function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#e8e8ed] py-6 text-center text-sm text-[#a1a1a6]">
      <p>© {new Date().getFullYear()} MyBlog. All rights reserved.</p>
    </footer>
  );
}

export default Footer;