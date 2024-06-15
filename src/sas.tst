    <div className="wrapper">
      <a href='https://inf.tech'><img className='logo' src='/public/Logo.png' alt='Logo' /></a>
      <h2>Welcome to INF PACK!</h2>
      <div className='window'>
        <h2>Why should you choose us</h2>
        <div className='window-window'>
          <h2>We have a default pack with optimization and the
          <br />most necessary mods, but you can install your own, 
          <br />or use an <label className='AI' >AI</label> mod and they will select mods for you to
          <br />suit your needs
          </h2>
        </div>
        <h3 className='centered-h3'>Choose your version and modloader</h3>
        <div className='select-c'>
          <Version />
          <Modloader />
        </div>
        <button className='btn-sumbit'>Create new pack</button>
        <label className="checkbox-container">
        <input type="checkbox" />
        <span className="checkmark"></span>
        <p>Use AI mode</p>
        </label>
      </div>
      <Footer />
    </div>